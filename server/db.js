const { Pool } = require("pg");

let envPath;

if (process.env.NODE_ENV === "prod") {
  envPath = ".env.prod";
} else if (process.env.NODE_ENV === "dev") {
  envPath = ".env.dev";
} else if (process.env.NODE_ENV === "test") {
  envPath = ".env.test";
} else {
  throw Error("No NODE_ENV found");
}

require("dotenv").config({
  path: envPath,
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
  close: () => pool.end(),
};
