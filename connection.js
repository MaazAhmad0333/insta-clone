const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "insta_clone",
});

module.exports = { db };
