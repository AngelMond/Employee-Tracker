//Libraries
let inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//Connetion to the database
const db = require('./config');

//Import query functions to call the database
let sqlFunctions = require('./sql')



function managerOptions() {
  console.log('\n');
  console.log('********************************** ');
  console.log('         EMPLOYEE TRACKER        ');
  console.log('********************************** ');
  console.log('\n');
  inquirer
  .prompt([
    
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
       sqlFunctions.viewAllDepartments();
        managerOptions();
      break;
      
      case 'View all roles':
      sqlFunctions.viewAllRoles();
      managerOptions();
      break;

      case 'View all employees':
      sqlFunctions.viewAllEmployees();
      managerOptions();
      break;

      case 'Add a department':
        createNewDepartment();
      break;

      case 'Add a role':
        createNewRole();
      break;

      case 'Add an employee':
        createNewEmployee();
      break;

      case 'Update an employee role':
        updateEmployee();
      break;
      
      case 'Finish':
      finish();
      break;
     }
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
}


//Function to create a new department
function createNewDepartment(){
  inquirer
  .prompt([
    {
      type: 'input',
      message: `Enter the name of the new department`,
      name: 'nameDepartment',
   }
  ]).then(userInput =>{
    const {nameDepartment } = userInput;

    //Creating  a new Department
    sqlFunctions.addDepartment(nameDepartment);
    console.log(`${nameDepartment} department has been successfully created`);
    managerOptions();
  })
}


//Function to create a new role
async function createNewRole(){

  /************* CODE TO GET THE DEPARTMENT ID AN NAME ***********************/
  //Emoty arrays to store department id and name
  let arrayDepartmentId = []
  let arrayDepartmentName = [];

  const [departmentsName, fields] = await db.promise().query('SELECT id, name FROM department'); 
  //Get the department id and depaertment name
  const deparmentsArray = departmentsName.map((element, index)=>{
    let departmentId = element.id;
    let departmentName = element.name;

    //Filling my empty arrays
    arrayDepartmentId.push(departmentId)
    arrayDepartmentName.push(departmentName)
  });

  /**************** CODE TO CHECK IF A ROLE ALREADY EXISTS *******************/
  //Get title roles to check if a role already exists
  const [roles, roleFields] = await db.promise().query('SELECT title FROM roles;'); 
  let roleName = roles.map((element, index)=>element.title);
  
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
    name: 'deparmentChoosen',
    choices: arrayDepartmentName
    }
   
  ]).then(userInput =>{
    const {nameRole, salary, deparmentChoosen} = userInput;

    //Validating the users input
    if(arrayDepartmentName.includes(deparmentChoosen)){

        //Validate if the role already exit
        if(roleName.includes(nameRole)  ){
          console.log(`\n Ups! The role already exists \n`)
          managerOptions();

        }else{
      /************GETTING THE DEPARTMENT ID ********************/
      //Get the index from the arrayDepartmentName 
      let indexDepartmentName = arrayDepartmentName.indexOf(deparmentChoosen);
     
      //DEPARTMENT ID
      let findDepartmentId = arrayDepartmentId[indexDepartmentName];
      
      //****** GIVING THE NAME OF THE NEW ROLE, THE SALARY AND THE DEPARTMENT ID TO THE FUNCTION TO CREATE THE NEW ROLE ********************* */
      sqlFunctions.addRole(nameRole, salary, findDepartmentId);
      }
    }
    managerOptions();
  })
}


//Function to create a new employee
async function createNewEmployee() {

   /****************** CODE TO GET THE ROLES ID **************************/
  //Empty arrays to store role id and role title
  let arrayIdRole = [];
  let arrayTitleRole = [];

  //Get the roles id and title from the DATABASE
  const [roles, rolesField] = await db.promise().query('SELECT id, title FROM roles'); 
  let arrayRoles = roles.map((element, index)=>{
    let id = element.id;
    let title = element.title;

    //Filling my empty arrays
    arrayIdRole.push(id)
    arrayTitleRole.push(title)
  });

   /****************** CODE TO GET JUST THE MANAGER'S NAME *************************/

  //Get the Managers name to show the user all managers available
  const [managersName, roleIdfields] = await db.promise().query(`
  SELECT CONCAT(manager.first_name, " ", manager.last_name) AS Manager 
  FROM employees employee
  LEFT JOIN employees Manager ON employee.manager_id = manager.id
  WHERE employee.id = 2 OR employee.id = 4 OR employee.id = 6 OR employee.id = 8;`); 
  //The user will see the choices from this array in the prompt
  let arrayManagers = managersName.map((element, index)=>element.Manager);

  /****************** CODE TO GET MANAGER'S ID **************************/
  //Empty arrays to store the manager's id and name
  let arrayManagerId = [];
  let arrayManagerName = [];

  //Get all employees id and name from the DATABASE
  const [idManager, idManagerfields] = await db.promise().query(`SELECT id, CONCAT(employees.first_name, ' ', employees.last_name)AS managerName FROM employees;`)
  let managerName = idManager.map((element, index)=>{
    let id = element.id;
    let name = element.managerName;

    //Filling empty arrays with the employees id and name
    arrayManagerId.push(id);
    arrayManagerName.push(name);
  });

 
  inquirer
  .prompt([
    {
      type: 'input',
      message: `What's the employee's first name?`,
      name: 'firstName',
    },
    {
      type: 'input',
      message: `What's the employee's last name?`,
      name: 'lastName',
    },
    {
     type: 'rawlist',
     message: `What is the employee's role?`,
     name: 'employeeRole',
     choices: arrayTitleRole
    },
    {
     type: 'rawlist',
     message: `What is the employee's manager?`,
     name: 'manager',
     choices: arrayManagers
    },
    
  ]).then(userInput =>{

    //Deconstruction the users input
    const {firstName, lastName, employeeRole, manager } = userInput;

    //Validate the users Input and compare if the users input is equal to the arrayTitleRole and arrayManagers
    if( arrayTitleRole.includes(employeeRole) && arrayManagers.includes(manager) ){
        
      //****************  GETTING THE ROLE ID ********************* */
      //Getting the index from the arrayTitleRole to search the id of the role
      const indexRole = arrayTitleRole.indexOf(employeeRole);

      //ROLE ID
      const findRoleId = arrayIdRole[indexRole];


      //****************  GETTING THE MANAGER ID ********************* */
      //Getting the index to search to id of the selected manager
      const managerIndex = arrayManagerName.indexOf(manager);

      //MANAGER ID
      const findManagerId = arrayManagerId[managerIndex]

      //********* GIVING THE FIRSTNAME, LASTNAME, ROLE ID AND MANAGER ID TO THE FUNCTION TO CREATE A NEW EMPLOYEE IN DATABASE ******* */
       sqlFunctions.addEmployee(firstName,lastName, findRoleId, findManagerId );
  
    }else{
      console.log(`Ups! We couldn't create the new employee`)
    }
    managerOptions();
  });
}



//In order to update an employee I need the Id from the Role and the Id from the employee
async function updateEmployee(){

 /****************** CODE TO GET EMPLOYEE'S ID **************************/

  //Empty Arrays will store the names and the id from each employee
  let employeeId = [];
  let employeeName = [];

  //Get all employees from DATABASE
  const [employees, fiels] = await db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employees;`);
  let employeesName = employees.map((element, index)=>{
      let name =  element.employee;
      let id = element.id

      //Fill the empty arrays with the names and the id of each employee
      employeeId.push(id)
      employeeName.push(name)  
    });
    

  /****************** CODE TO GET THE ROLE ID AND NAME OF EACH ROLE **************************/
  //Arrys will store the id and titles from the roles table
  let idFromRoles = []
  let titleFromRoles = []

  //Getting the role id and role title
  const [nameRolesId, fieldsId] = await db.promise().query(`SELECT  roles.id, roles.title FROM roles`);
  let roleId = nameRolesId.map((element, index)=>{
      let id = element.id; 
      let title = element.title

      //Filling my empty arrays with the role title and role id
      titleFromRoles.push(title)
      idFromRoles.push(id)
  });


  inquirer
  .prompt([
    {
      type: 'rawlist',
      message: `Which employee's role do you want to update?` ,
      name: 'employee',
      choices: employeeName
    },
    {
      type: 'rawlist',
      message: 'Which role do you want to assign to the selected employee?',
      name: 'updateRole',
      choices: titleFromRoles
    }
  ])
  .then(userChoices=>{
    const {employee, updateRole } = userChoices;

    //Validating the users input
    if(titleFromRoles.includes(updateRole) && employeeName.includes(employee)){
      console.log('Se ha encontrado el rol y nombre del employee a actualizar')

      //****************  GETTING THE EMPLOYEE ID ********************* */
      //Find the index from the ARRAY employeeName with the employee the user pick
      let findIndexEmployee = employeeName.indexOf(employee);

      //Search the employee ID  with the index
      let findEmployeeId = employeeId[findIndexEmployee];


      //****************  GETTING THE ROLE ID ********************* */
      //Search the role index from the users choice
      let indexRole = titleFromRoles.indexOf(updateRole);
    
      //GETTING THE ID FROM THE ROLE
      let findRoleId = idFromRoles[indexRole]
      // console.log(findRoleId)

      //****************  GIVING THE (EMPLOYEE ID) AND (ROLE ID) TO THE FUNCTION ********************* */
      //Updating employee in the DATABASE
      sqlFunctions.addUpdatedEmployee(findRoleId, findEmployeeId);
    }else{
      console.log(`Ups! Couldn't find the employee or the role`)
    }
    managerOptions();
  })
}


function finish(){
  
  return console.log(  "BYE BYE! :)") ;
}


managerOptions();







  



  