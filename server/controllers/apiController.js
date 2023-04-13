const apiController = {};
const { exec } = require('child_process');

apiController.postCommand = (req, res, next) => {
  const { command, cwd } = req.body;
  // Exec is a child process in node that asynchronously creates a shell and executes the provided command
  // More info: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
  exec(command, { cwd }, (err, stdout, stderr) => {
    // Handle failed command execution
    if (err) {
      return next({
        log: 'Exec error in apiController.postCommand: Invalid command',
        status: 500,
        message: { err: 'Invalid command' },
      });
    }
    // Handle successful command execution but returned error (stderr)
    if (stderr) {
      return next({
        log: `Exec error in apiController.postCommand: ${stderr}`,
        status: 500,
        message: { err: stderr },
      });
    }
    // Handle successful command execution with no errors
    console.log(`Response: `, stdout);
    res.locals.cliResponse = stdout;
    return next();
  });
};

module.exports = apiController;
