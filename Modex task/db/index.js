const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  // Fix for local postgres: usually doesn't support SSL by default
  ssl: process.env.SUPABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

module.exports = pool;
