--Department Seeds
INSERT INTO department(name)
VALUES 
("Engineering"),
("Finance"),
("Sales"),
("Legal");


----------------------------------------------------

--Roles Seeds
INSERT INTO roles(title, salary, department_id) 
VALUES 
("Lead Engineer", 200000, 1),
("Software Engineer", 160000, 1),
("Account Manager", 170000, 2),
 ("Account", 140000, 2),
 ("Sales Lead", 110000, 3),
 ("Sales Person", 85000, 3),
 ("Team Lead", 160000, 4),
 ("Lawyer", 130000, 4);

----------------------------------------------------

--Employees Seeds
INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES 
("Dominic", "Toretto", 1, null),
("Brian", "O'Conner", 2, 1),
("Checo", "Perez", 3, null),
("Max", "Verstappen", 4, 3 ),
("Nikki", "Lauda", 5, null),
("James", "Hunter", 6, 5),
("Fernando", "Alonso", 7, null),
("Lewis", "Hamilton", 8, 7);

