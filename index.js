var inquirer = require('./assets/node_modules/inquirer/lib/inquirer');



inquirer
  .prompt([
    /* Pass your questions in here */
     {
        type: 'rawlist',
        message: 'What would you like to do?',
        name: 'ManagerOptions',
        choices: ['View all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role' ]
        
     }
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

