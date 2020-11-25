const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
//const db = require("./db");

const util = require("util");

// lookup util to promisify callbacks
//connection.query = util.promisfy(connection.query)
// const employee = connection.query(query)

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
        "TEST",
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
        case "TEST":
          roleSelection().then((result) => {
            return result;
          });
          break;
      }
    });
};

// view employees function
const viewEmployees = () => {
  //console.log("View employees here");

  //   view employees query -- does not include manager
  const query = `SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log("\n");
    console.log(table);
    //connection.end();
    manageEmployees();
  });
};

// view departments function
const viewDepartments = () => {
  // console.log("View departments here");
  const query = `SELECT name as department FROM department;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log("\n");
    console.log(table);
    //connection.end();
    manageEmployees();
  });
};
// sql queries for inquirer prompts to add employees

// const roleSelection = () => {
//   let roles = [];

//   const query = `SELECT title FROM role;`;
//   connection.query(query, (err, res) => {
//     if (err) throw err;

//     for (let i = 0; i < res.length; i++) {
//       roles.push(res[i].title);
//     }
//   });
//   return roles;
// };

// sql queries for inquirer prompts to add employees

const managerSelection = () => {
  let managers = ["none"];

  const query = `SELECT concat_ws(" ", first_name, last_name) AS manager FROM employee`;
  connection.query(query, (err, res) => {
    if (err) throw err;

    for (let i = 0; i < res.length; i++) {
      managers.push(res[i].manager);
    }
  });
  return managers;
};

// view roles function
const viewRoles = () => {
  console.log("View roles here");
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

// insert employee to databases function

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

// get role_id of selected role
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

const roleSelection = async () => {
  const query = `SELECT title FROM role;`;

  const rolesData = await connection.query(query);
  const roles = [];
  for (let i = 0; i < rolesData.length; i++) {
    roles.push(rolesData[i].title);
  }
  return roles;
};

// add employee function
const addEmployee = async () => {
  //console.log("add employees here");
  const role = await roleSelection();

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
        choices: managerSelection(),
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
      //manageEmployees();
    });
};

// add department function
const addDepartment = () => {
  console.log("add department here");
  inquirer
    .prompt({
      name: "department",
      message: "What Department would you like to add?",
      type: "input",
    })
    .then(({ department }) => {
      connection.query(
        `INSERT INTO department SET ?`,
        {
          name: department,
        },
        (err) => {
          if (err) throw err;
          console.log(`New Department: ${department} was added!`);
          manageEmployees();
        }
      );
    });
};

// view departments to select
const departmentSelection = () => {
  let departments = [];

  const query = `SELECT name FROM department;`;
  connection.query(query, (err, res) => {
    if (err) throw err;

    for (let i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }
  });
  return departments;
};

const getDepartmentId = (department) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id FROM department WHERE name = ?`,
      [department],
      (err, res) => {
        if (err) reject(err);
        //console.log("test 2");
        //console.log(res[0].id);
        department_id = res[0].id;
        //return role_id;
        resolve(res[0].id);
      }
    );
  });
};

// add role function
const addRoles = async () => {
  console.log("add roles here");
  inquirer
    .prompt([
      {
        name: "roles",
        message: "What Role would you like to add?",
        type: "input",
      },
      {
        name: "salary",
        message: "What is the salary for this role?",
        type: "input",
      },
      {
        name: "department",
        message: "What department does this role belong to?",
        type: "list",
        choices: departmentSelection(),
      },
    ])
    .then(async ({ roles, salary, department }) => {
      console.log(`${roles} | ${salary} | ${department}`);

      let department_id = await getDepartmentId(department);
      console.log(department_id);
      connection.query(
        `INSERT INTO role SET ?`,
        {
          title: roles,
          salary: salary,
          department_id: department_id,
        },
        (err) => {
          if (err) throw err;
          console.log(`New Role: ${roles} was added!`);
          viewRoles();
        }
      );
    });
};

//update employee roles function
const updateEmployeeRole = async () => {
  //   console.log("update employee role here");
  const employee = await employeeSelection();
  const role = await roleSelection();
  //employeeSelection();
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which Employee do you want to change Roles?",
        choices: employee, //enter choices
      },
      {
        name: "newRole",
        type: "list",
        message: "What is the Employee's new Role?",
        choices: role,
      },
    ])
    .then(({ employee, newRole }) => {
      console.log(`${employee} | ${newRole}`);
      console.log("\n");
      viewEmployees();
    });
};

const employeeSelection = async () => {
  const query = `SELECT concat_ws(" ", first_name, last_name) AS employee FROM employee;`;

  const employeeData = await connection.query(query);
  const employees = [];
  for (let i = 0; i < employeeData.length; i++) {
    employees.push(employeeData[i].employee);
  }
  return employees;
};

// const blah = () => {
//   const query = `SELECT first_name AS employee FROM employee;`;
//   connection.query(query, (err, res) => {
//     if (err) throw err;
//     let employees = [];

//     for (let i = 0; i < res.length; i++) {
//       employees.push(res[i].employee);
//     }
//     //console.log(employees);
//     return employees;
//   });
// };

//manageEmployees();
