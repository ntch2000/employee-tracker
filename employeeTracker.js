const inquirer = require("inquirer");
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

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  manageEmployees();
  //connection.end();
});

const manageEmployees = () => {
  inquirer
    .prompt({
      name: "selection",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
      ],
    })
    .then((answer) => {
      switch (answer.selection) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRoles();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
      }
    });
};

// view employees function
const viewEmployees = () => {
  console.log("View employees here");

  // view employees query -- does not include manager
  const query = `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary FROM employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log(table);
    connection.end();
  });
};

// view departments function
const viewDepartments = () => {
  console.log("View departments here");
  const query = `SELECT name as department FROM department;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log(table);
    connection.end();
  });
};

// view roles function
const viewRoles = () => {
  console.log("View roles here");
  const query = `SELECT title FROM role;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log(table);
    connection.end();
  });
};

// add employee function
const addEmployee = () => {
  console.log("add employees here");
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: [
          // view all roles sql query here
          "view all roles sql query here",
        ],
      },
    ])
    .then((answers) => {
      //sql query to insert employee here
      console.log(answers);
    });
};

// add department function
const addDepartment = () => {
  console.log("add department here");
};

// add role function
const addRoles = () => {
  console.log("add roles here");
};

//update employee roles function
const updateEmployeeRole = () => {
  console.log("update employee role here");
};
