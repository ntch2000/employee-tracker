const mysql = require("mysql");
const cTable = require("console.table");

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

// view employees query -- does not include manager
// const query = `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary FROM employee
// INNER JOIN role ON employee.role_id = role.id
// INNER JOIN department ON role.department_id = department.id;`;
// connection.query(query, (err, res) => {
//   if (err) throw err;
//   const table = cTable.getTable(res);
//   console.log(table);
