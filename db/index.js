//require connection here **
const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  //FindALL
  findAllEmp() {
    this.connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      return res;
    });
  }

  //CreateEmployee
  CreateEmployee(employee) {
    return this.connection.query();
  }

  //

  //
}

module.exports = new DB(connection);
// create class and constructors here
// constructor would hold the connection

// view employees query -- does not include manager
// const query = `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary FROM employee
// INNER JOIN role ON employee.role_id = role.id
// INNER JOIN department ON role.department_id = department.id;`;
// connection.query(query, (err, res) => {
//   if (err) throw err;
//   const table = cTable.getTable(res);
//   console.log(table);
