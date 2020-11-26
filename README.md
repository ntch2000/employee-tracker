# employee-tracker

## Description

This is a Content Management Systems that allows users to manage their Employee Database from a command line interface. Users are able to view all employee information, including their names, roles, salary, and managers. Users can also update various information such as the roles for their organization, the departments, and employees themselves.

- [Description](#description)
- [User Story](#user-story)
- [Application Screenshot](#application-screenshot)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)

## User Story

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Application Screenshot

## Installation

In order to run this application, users must have a MySQL database and implement the schema.sql and seed.sql files. The database schema should look like the below.

![Database Schema](./Assets/schema.png "Database Schema")
_employee-tracker-db Database schema_

Once the database is created in MySQL, the employeeTracker.js file will need to be altered to ensure a proper connection can be made. Users must ensure their MySQL password is updated in the file to connect to their own sql server.

There are a few node.js packages that must also be installed in order for this to work properly.

- [NPM Inquirer](https://www.npmjs.com/package/inquirer)
  Allows for the application to prompt the user with questions and receive answers via the command line.
- [Mysql](https://www.npmjs.com/package/mysql)
  Allows for the connection to the MySQL database and for performing the SQL queries for viewing and altering the data.
- [console.table](https://www.npmjs.com/package/console.table)
  Provides a better way to format the sql data when printed to the console.

## Usage

To use this application, the project files can be forked from my GitHub repository at [GitHub](https://github.com/ntch2000/employee-tracker).

Once the files are copied over, cd into the project directory and install the dependencies by using the following command.

```node.js
npm install
```

Once the dependencies are installed, the application can be run from the project directory by running the following command.

```node.js
node employeeTracker.js
```

The application will then prompt the user with the menu of options. The user can select the option they desire and follow the prompts to accomplish their task. The following commands are available currently.

- View All Employees
- View All Departments
- View All Roles
- Add Employee
- Add Department
- Add Role
- Update Employee Role

A walkthrough video on how to use this application can be found at [Employee Tracker Application]().

## Credits

- Peter Colella Was a great help to me on this project as he helped me understand async/await functions.
