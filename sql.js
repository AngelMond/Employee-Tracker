var inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express')
const app = express();

//Conection to database
const db = require('./config');
const cTable = require('console.table');
const res = require('express/lib/response');
  



  async function getRoleTitle() {
      
    const [rolesTitle, rolesField] = await db.promise().query('SELECT roles.title FROM roles'); 

    const newArr = rolesTitle.map((element, index)=>{
      const arrTitles = element.title;
      return arrTitles
    })
    console.log(newArr)
}

// getRoleTitle()


  
  async  function getRoleId(){
    
    const [rolesId, fields] = await db.promise().query('SELECT roles.id FROM roles'); 

    const newArrId = rolesId.map((element, index)=>{
      const arrId = element.id;
      return arrId;
    })
    console.log(newArrId)
  }
    
  getRoleId()


  



  async function viewAllDepartments() {
    // query database using promises
    const [rows,fields] = await db.promise().query("SELECT * FROM department;")
    .catch(err=>{console.log('Ups! Something went wrong when calling database')});
    console.log("--------------------  ALL DEPARTMENS  --------------------- \n");
    console.table(rows);
    console.log('Press Space or move key Up or Down to select another choice');
  }

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

  

  function addDepartment(newDepartment) {
    // query database using promises
    db.query(`
    INSERT INTO department(name) VALUES (?);`, newDepartment, (err, result)=>{
      if(err){
        console.log("Ups! Something went wrong when trying to connect to database");
      }else{
        console.log(`${newDepartment} department successfully added`);
      }
    });
  }



function addRole(newRole, salary, departmentBelong){
  db.query(`INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`, [newRole, salary, departmentBelong] ,(err, result)=>{
    if(err){
      console.log("Ups! Something went wrong when trying to connect to database");
    } else{
      console.log(`${newRole} role successfully added`);
    }
  });

}


// function addSalary(salary){
//   db.query(`INSERT INTO roles(salary) VALUES (?)`,salary, (err, result)=>{
//     if(err){
//       console.log("Ups! Something went wrong when trying to connect to database");
//     } else{
//       console.log(`Salary for new role successfully Updated`);
//     }
//   });
// }


function addEmployee (firstName, lastName, roleId, managerId){
  db.query(`
  INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [firstName, lastName, roleId, managerId], (err, result)=>{
    if(err){
      console.log("Ups! Something went wrong when trying to connect to database");
    }else{
      console.log(`${newDepartment} department successfully added`);
    }
  });
}






  module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  getRoleTitle,
  getRoleId
  // updateEmployeeRol,
  }

 