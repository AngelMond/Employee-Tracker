
---Primera consulta (All Departments)
SELECT * FROM department;


----Segunda Consulta de (View All Roles)
SELECT roles.id, roles.title AS Title, department.name AS Department,  roles.salary AS Salary
FROM roles
JOIN department ON roles.department_id = department.id;


---Tercera Consulta (View all employees)
SELECT employee.id, employee.first_name AS FirstName, employee.last_name AS LastName, roles.title AS Title, 
department.name AS Department, roles.salary AS Salary, CONCAT(manager.first_name, " ", manager.last_name) AS Manager 
FROM employees employee
LEFT JOIN employees Manager ON employee.manager_id = manager.id
LEFT JOIN roles ON employee.role_id = roles.id 
LEFT JOIN department ON roles.department_id = department.id;
