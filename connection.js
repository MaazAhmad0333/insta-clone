const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.SERVERHOST,
  user: process.env.SERVERUSER,
  password: process.env.SERVERPASSWORD,
  database: process.env.SERVERDATABASE,
});

module.exports = { db };
