-- initial seed data for departments
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

-- initial seed data for roles
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2), ("Account Manager", 140000, 3), ("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);

-- initial seed data for employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 3), ("Mike", "Chan", 2, 1), ("Ashley", "Rodriguez", 3, null), ("Kevin", "Tupik", 4, 3), ("Malia", "Brown", 6, null),
("Sarah", "Lord", 7, null), ("Tom", "Allen", 8, 6), ("Christian", "Eckenrode", 3, 2);