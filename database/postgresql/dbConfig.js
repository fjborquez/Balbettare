require("dotenv").config();
const {Client, Pool} = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST || "localhost"}:${process.env.PSQL_PORT}/${process.env.PSQL_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction
});

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

module.exports = { client, pool };