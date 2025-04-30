import sqlite3 from "sqlite3";
import { open } from "sqlite";

const API_KEY = process.env.API_KEY;

// db path: db\auth.db
// current path: backend\src\db\connection.js

const connection = await open({
  filename: "../../../db/auth.db", // path relative to the current file
  driver: sqlite3.Database,
});

export default connection;
