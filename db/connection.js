const mysql = require("mysql");
// connection js file =============

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Tych2020",
  database: "employee_tracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  connection.query();
});

// connection file end ================

module.exports = connection;
