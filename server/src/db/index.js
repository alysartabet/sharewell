const { Pool } = require("pg");
require("dotenv").config();

//For Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If any SSL issues with Supabase:
  // ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected PG pool error", err);
  process.exit(-1);
});

function query(text, params) {
  return pool.query(text, params);
}

// Transaction helper used by ordersController + xpService + equityService
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Error during ROLLBACK:", rollbackErr);
    }
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  withTransaction,
};
