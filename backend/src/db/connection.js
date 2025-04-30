import sqlite3 from "sqlite3";
import { open } from "sqlite";

const API_KEY = "123";
const SECRET = "123";

// test2
// db path: db\auth.db
// current path: backend\src\db\connection.js

const connection = await open({
  filename: "../../../db/auth.db", // path relative to the current file
  driver: sqlite3.Database,
});

export default connection;
