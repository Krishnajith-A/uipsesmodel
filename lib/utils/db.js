import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Start a transaction
    const result = await client.query(text, params);
    await client.query("COMMIT"); // Commit the transaction
    return result.rows;
  } catch (e) {
    await client.query("ROLLBACK"); // Rollback the transaction if there's an error
    throw e;
  } finally {
    await client.release();
  }
};
