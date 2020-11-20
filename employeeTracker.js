const inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
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
  connection.end();
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
};

// view departments function
const viewDepartments = () => {
  console.log("View departments here");
};

// view roles function
const viewRoles = () => {
  console.log("View roles here");
};

// add employee function
const addEmployee = () => {
  console.log("add employees here");
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
