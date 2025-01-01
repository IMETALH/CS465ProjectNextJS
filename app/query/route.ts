import dotenv from 'dotenv';
import { db } from '@vercel/postgres'; // Use db from @vercel/postgres

dotenv.config();

async function listInvoices() {
  try {
    const client = await db.connect(); // Establish connection to the database
    const data = await client.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    client.release(); // Release the client after query execution
    return data.rows; 
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error; // Rethrow error to be handled in GET
  }
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return new Response(JSON.stringify(invoices), { status: 200 });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}