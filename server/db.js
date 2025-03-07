const { Pool } = require("pg");
require("dotenv").config({
  path: process.env.NODE_ENV === "prod" ? ".env.prod" : ".env.dev",
});

/*
const pool = new Pool({
  user: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  host: process.env.POSTGRESQL_HOST,
  port: process.env.POSTGRESQL_PORT, // default Postgres port
  database: process.env.POSTGRESQL_DB,
});
*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
