-- SQL file to create seed data for the database

-- drops the database if it already exists
DROP DATABASE IF EXISTS employee_tracker_db;

-- creates the database
CREATE DATABASE employee_tracker_db;

-- sets the database to be used
USE employee_tracker_db;

-- create the department table
CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);

-- create the role table
CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL,
-- This will be a foreign key referencing department id
department_id INT NOT NULL,
PRIMARY KEY (id)
);

-- create the employee table
CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
-- set as foreign key references role id
role_id INT NOT NULL,
-- set as foreign key to another employee that 
manager_id INT,
PRIMARY KEY (id)
);

