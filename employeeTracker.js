const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
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
  //   view employees query
  const query = `SELECT e1.id, e1.first_name, e1.last_name, title, name AS department, salary, concat_ws(" ", e2.first_name, e2.last_name) AS manager 
  FROM employee e1 LEFT JOIN employee e2 ON e1.manager_id = e2.id
  INNER JOIN role ON e1.role_id = role.id
  INNER JOIN department ON role.department_id = department.id;`;
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
  const query = `SELECT id, name as department FROM department;`;
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
  const query = `SELECT role.id, title, salary, name AS department 
  FROM role JOIN department on role.department_id = department.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const table = cTable.getTable(res);
    console.log("\n");
    console.log(table);
    manageEmployees();
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
        role_id = res[0].id;
        resolve(res[0].id);
      }
    );
  });
};

// function to get employee_id from employee table
const getEmployeeId = (manager) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id FROM employee WHERE concat_ws(" ", first_name, last_name) = ?`,
      [manager],
      (err, res) => {
        if (err) reject(err);
        manager_id = res[0].id;
        resolve(res[0].id);
      }
    );
  });
};

// function to insert new employee into database
const insertEmployee = (firstName, lastName, role_id, employee_id = null) => {
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

// prompts the user for the new employee information
const addEmployee = async () => {
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
      const { firstName, lastName, role, manager } = answers;
      let role_id = await getRoleId(role);

      if (manager === "none") {
        insertEmployee(firstName, lastName, role_id);
      } else {
        let manager_id = await getEmployeeId(manager);
        insertEmployee(firstName, lastName, role_id, manager_id);
      }
    });
};

// ================================================
// add department section
// ===============================================

// prompts the user for the new department information
const addDepartment = () => {
  console.log("add department here");
  inquirer
    .prompt({
      name: "department",
      message: "What Department would you like to add?",
      type: "input",
    })
    .then(({ department }) => {
      // adds the department to the database
      connection.query(
        `INSERT INTO department SET ?`,
        {
          name: department,
        },
        (err) => {
          if (err) throw err;
          console.log(`New Department: ${department} was added!`);
          viewDepartments();
        }
      );
    });
};

// ================================================
// add role section
// ===============================================

// prompts the user for the new role information
const addRoles = async () => {
  const departments = await departmentSelection();

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
        choices: departments,
      },
    ])
    .then(async ({ roles, salary, department }) => {
      console.log(`${roles} | ${salary} | ${department}`);

      // adds the new role into the database
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

// get an array of departments
const departmentSelection = async () => {
  const query = `SELECT name FROM department;`;

  const departmentData = await connection.query(query);
  const departments = [];
  for (let i = 0; i < departmentData.length; i++) {
    departments.push(departmentData[i].name);
  }
  return departments;
};

// get the id number for the department passed in
const getDepartmentId = (department) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id FROM department WHERE name = ?`,
      [department],
      (err, res) => {
        if (err) reject(err);
        department_id = res[0].id;
        resolve(res[0].id);
      }
    );
  });
};

// ================================================
// add role section
// ===============================================

// prompts the user for updating employee information
const updateEmployeeRole = async () => {
  const employee = await employeeSelection();
  const role = await roleSelection();

  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which Employee do you want to change Roles?",
        choices: employee,
      },
      {
        name: "newRole",
        type: "list",
        message: "What is the Employee's new Role?",
        choices: role,
      },
    ])
    .then(async ({ employee, newRole }) => {
      console.log(`${employee} | ${newRole}`);
      console.log("\n");
      let role_id = await getRoleId(newRole);
      let employee_id = await getEmployeeId(employee);
      // update employee in database
      updateEmpRole(employee_id, role_id);
    });
};

// updates the employee in the database
const updateEmpRole = (employee_id, role_id) => {
  connection.query(
    `UPDATE employee SET role_id = ?
      WHERE id = ?;`,
    [role_id, employee_id],
    (err) => {
      if (err) throw err;
      console.log("\n");
      console.log("Employee Role updated successfully!");
      viewEmployees();
    }
  );
};
