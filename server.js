const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

// maybe need this
const util = require("util");

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
});

connection.query = util.promisify(connection.query);

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
        "Quit",
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
        case "Quit":
          connection.end();
          break;
      }
    });
};

// ================================================
// view employees function
// ===============================================

const viewEmployees = () => {
  //   view employees query -- does not include manager
  const query = `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary FROM employee
      INNER JOIN role ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log("\n");
    console.log(table);

    manageEmployees();
  });
};

// ================================================
// view departments function
// ===============================================
const viewDepartments = () => {
  const query = `SELECT name as department FROM department;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log("\n");
    console.log(table);

    manageEmployees();
  });
};

// ================================================
// view roles function
// ===============================================
const viewRoles = () => {
  const query = `SELECT title FROM role;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log("\n");
    console.log(table);
    manageEmployees();
    //connection.end();
  });
};

// ================================================
// add employee section
// ===============================================

// role array for inquirer prompt choices
const roleSelection = async () => {
  const query = `SELECT title FROM role;`;

  const rolesData = await connection.query(query);
  const roles = [];
  for (let i = 0; i < rolesData.length; i++) {
    roles.push(rolesData[i].title);
  }
  return roles;
};

// employee array for inquirer prompt choices
const employeeSelection = async () => {
  const query = `SELECT concat_ws(" ", first_name, last_name) AS employee FROM employee;`;

  const employeeData = await connection.query(query);
  const employees = [];
  for (let i = 0; i < employeeData.length; i++) {
    employees.push(employeeData[i].employee);
  }
  return employees;
};

// function to get the role_id from the role table
const getRoleId = (role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id FROM role WHERE title = ?`,
      [role],
      (err, res) => {
        if (err) reject(err);
        //console.log("test 2");
        //console.log(res[0].id);
        role_id = res[0].id;
        //return role_id;
        resolve(res[0].id);
      }
    );
  });
};

// function to get manager_id from manager table
const getManagerId = (manager) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id FROM employee WHERE concat_ws(" ", first_name, last_name) = ?`,
      [manager],
      (err, res) => {
        if (err) reject(err);
        //console.log("test 2");
        //console.log(res[0].id);
        manager_id = res[0].id;
        //return role_id;
        resolve(res[0].id);
      }
    );
  });
};

// function to insert new employee into database
const insertEmployee = (firstName, lastName, role_id, employee_id = null) => {
  //console.log("test 3");
  connection.query(
    `INSERT INTO employee SET ?`,
    {
      first_name: firstName,
      last_name: lastName,
      role_id: role_id,
      manager_id: employee_id,
    },
    (err) => {
      if (err) throw err;
      console.log("\n");
      console.log("Employee added successfully!");

      viewEmployees();
    }
  );
};

const addEmployee = async () => {
  //console.log("add employees here");
  const role = await roleSelection();
  const employee = await employeeSelection();
  employee.push("none");

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
        choices: role,
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: employee,
        default: "none",
      },
    ])
    .then(async (answers) => {
      //sql query to insert employee here

      const { firstName, lastName, role, manager } = answers;
      let role_id = await getRoleId(role);

      if (manager === "none") {
        insertEmployee(firstName, lastName, role_id);
      } else {
        let manager_id = await getManagerId(manager);
        insertEmployee(firstName, lastName, role_id, manager_id);
      }
      manageEmployees();
    });
};
