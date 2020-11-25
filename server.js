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

// function to get employee_id from employee table
const getEmployeeId = (manager) => {
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
        let manager_id = await getEmployeeId(manager);
        insertEmployee(firstName, lastName, role_id, manager_id);
      }
      //viewEmployees();
      manageEmployees();
    });
};

// ================================================
// add department section
// ===============================================

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
          viewDepartments();
          manageEmployees();
        }
      );
    });
};

// ================================================
// add role section
// ===============================================

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
          //manageEmployees();
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
        //console.log("test 2");
        //console.log(res[0].id);
        department_id = res[0].id;
        //return role_id;
        resolve(res[0].id);
      }
    );
  });
};

// ================================================
// add role section
// ===============================================

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
    .then(async ({ employee, newRole }) => {
      console.log(`${employee} | ${newRole}`);
      console.log("\n");
      let role_id = await getRoleId(newRole);
      let employee_id = await getEmployeeId(employee);
      // update employee in database
      updateEmpRole(employee_id, role_id);
      //viewEmployees();
    });
};

const updateEmpRole = (employee_id, role_id) => {
  //console.log("test 3");
  connection.query(
    `UPDATE employee SET role_id = ?
      WHERE id = ?;`,
    [role_id, employee_id],
    (err) => {
      if (err) throw err;
      console.log("\n");
      console.log("Employee Role updated successfully!");
      viewEmployees();
      //manageEmployees();
    }
  );
};
