const apiController = {};
const { exec } = require('child_process');

apiController.postCommand = (req, res, next) => {
  const { command } = req.body;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('stderr: ', stderr);
      return next({
        log: 'Exec error in apiController.postCommand',
        status: 500,
        message: { err: 'Invalid command' },
      });
    }
    console.log(`Response: `, stdout);
    res.locals.cliResponse = stdout;
    return next();
  });
};

module.exports = apiController;
