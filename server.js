let inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express')
const app = express();


const cTable = require('console.table');
  

//Import query functions to call the database
let sqlCalls = require('./sql')






function managerOptions() {

  console.log('********************************** ');
  console.log('         EMPLOYEE TRACKER        ');
  console.log('********************************** ');
  inquirer
  .prompt([
    /* Pass your questions in here */
     {
        type: 'rawlist',
        message: 'What would you like to do?',
        name: 'ManagerOptions',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Finish' ]
     }
  ])
  .then((userChoice) => {
     switch(userChoice.ManagerOptions){
      case 'View all departments':
       sqlCalls.viewAllDepartments();
        managerOptions();
      break;
      
      case 'View all roles':
      sqlCalls.viewAllRoles();
      managerOptions();
      break;

      case 'View all employees':
      sqlCalls.viewAllEmployees();
      managerOptions();
      break;

      case 'Add a department':
        newDepartment();
      break;

      case 'Add a role':
        newRole();
      break;

      case 'Add an employee':
        newEmployee();
      break;

      case 'Update an employee role':

      break;
      
      default: 'Finish'
      
      break;

     }

    // Use user feedback for... whatever!!
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
}

function newDepartment(){
  inquirer
  .prompt([
    {
      type: 'input',
      message: `Enter the name of the new department`,
      name: 'nameDepartment',
   }
  ]).then(userInput =>{
    const {nameDepartment } = userInput;

    //Adding a new Department
    sqlCalls.addDepartment(nameDepartment);
    console.log(`${nameDepartment} department has been successfully added`);
    managerOptions();
  })
}




function newRole(){
  inquirer
  .prompt([
    {
      type: 'input',
      message: `Enter the name of the new role`,
      name: 'nameRole',
   },
   {
    type: 'number',
    message: `What's the salary of the new role`,
    name: 'salary',
   },
   {
    type: 'rawlist',
    message: `Which department does the role belong to?`,
    name: 'deparmentId',
    choices: ['Engineering', 'Finance', 'Sales', 'Legal']
   }
   
  ]).then(userInput =>{
    const {nameRole, salary, deparmentId} = userInput;

    let engineering = 1;
    let finance = 2;
    let sales = 3;
    let legal = 4;

    switch(deparmentId){
      case 'Engineering':
        sqlCalls.addRole(nameRole, salary, engineering);
      break;
      
      case 'Finance':
        sqlCalls.addRole(nameRole, salary, finance);
        break;
      
      case 'Sales':
        sqlCalls.addRole(nameRole, salary, sales);
        break;
      
      case 'Legal':
        sqlCalls.addRole(nameRole, salary, legal);
      break;
    }

    //Adding a new Department
    
    console.log(`${nameRole} department has been successfully added`);

    managerOptions();
  })
}




function newEmployee(){
  inquirer
  .prompt([
    {
     type: 'rawlist',
     message: `What is the employee's role?`,
     name: 'employeeRole',
     choices: sqlCalls.getRoleTitle()
    },
    {
      type: 'input',
      message: `What's the employee's first name?`,
      name: 'firstName',
   },
   {
    type: 'input',
    message: `What's the employee's las name?`,
    name: 'lastName',
   }
   
  ]).then(userInput =>{
    // switch(userInput.employeeRole){
    //   case 
    // }
  })
}




managerOptions();







  



  