var inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express')
const app = express();

//Conection to database
const db = require('./config');
const cTable = require('console.table');

  

//QUERY TO VIEW ALL DEPARTMENTS FROM DATABASE
async function viewAllDepartments() {
  // query database using promises
  const [rows,fields] = await db.promise().query("SELECT * FROM department;")

  .catch(err=>{console.log('Ups! Something went wrong when calling database')});
  console.log("--------------------  ALL DEPARTMENS  --------------------- \n");
  console.table(rows);
  console.log('Press Space or move key Up or Down to select another choice');
}


  //QUERY TO VIEW ALL ROLES FROM DATABASE
async function viewAllRoles() {
  // query database using promises
  const [rows,fields] = await db.promise().query(
  `SELECT roles.id, roles.title AS Title, department.name AS Department,  roles.salary AS Salary
  FROM roles
  JOIN department ON roles.department_id = department.id;`)

  .catch(err=>{console.log('Ups! Something went wrong when calling database')});
  console.log("--------------------  ALL ROLES  --------------------- \n");
  console.table(rows);
  console.log('Press Space or move key Up or Down to select another choice');
}
 

//QUERY TO VIEW ALL EMPLOYEES FROM DATABASE
async function viewAllEmployees() {
  
  // query database using promises
  const [rows,fields] = await db.promise().query(
  `SELECT employee.id, employee.first_name AS FirstName, employee.last_name AS LastName, roles.title AS Title, 
  department.name AS Department, roles.salary AS Salary, CONCAT(manager.first_name, " ", manager.last_name) AS Manager 
  FROM employees employee
  LEFT JOIN employees Manager ON employee.manager_id = manager.id
  LEFT JOIN roles ON employee.role_id = roles.id 
  LEFT JOIN department ON roles.department_id = department.id;`)

  .catch(err=>{console.log('Ups! Something went wrong when calling database')});

  console.log("--------------------  ALL EMPLOYEES  --------------------- \n");
  console.table(rows); 
  console.log('Press Space or move key Up or Down to select another choice');
}


//QUERY TO ADD A NEW DEPARTMENT TO DATABASE
function addDepartment(newDepartment) {
  // query database using promises
  db.query(`
  INSERT INTO department(name) VALUES (?);`, newDepartment, (err, result)=>{
    if(err){
      console.log("Ups! Something went wrong when trying to connect to database");
    }
    // else{
    //   console.log(`${newDepartment} department successfully added`);
    // }
  });
}


//QUERY TO ADD A NEW ROLE TO DATABASE
function addRole(newRole, salary, departmentId){
  db.query(`INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`, [newRole, salary, departmentId] ,(err, result)=>{
    if(err){
      console.log("Ups! Something went wrong when trying to connect to database");
    } else{
      console.log(`${newRole} role successfully created`);
    }
  });

}


//QUERY TO ADD A NEW EMPLOYEE TO DATABASE
function addEmployee (firstName, lastName, roleId, managerId){
  db.query(`
  INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [firstName, lastName, roleId, managerId],
  (err, result)=>{
    if(err){
      console.log("Ups! Something went wrong when trying to connect to database");
    }else{
      console.log(` New Employee successfully added`);
    }
  });
}
  

//QUERY TO UPDATE AN EMPLOYEE ROLE
function addUpdatedEmployee (newIdRole, employeeId){
  db.query(`
  UPDATE employees SET role_id = ? WHERE id = ?;`, [newIdRole, employeeId ],
  (err, result)=>{
    if(err){
      console.log("Ups! Something went wrong when trying to connect to database");
    }else{
      console.log(`Employee successfully updated`);
    }
  });
}



//MODULES TO EXPORT TO SERVER.JS
  module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  addUpdatedEmployee
  
  }

 