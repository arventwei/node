var log4js = require('log4js');
var fs = require('fs'); // 引入fs模块 


if(fs.existsSync('./app.log')){
  fs.unlinkSync('./app.log');
}


log4js.configure({
    appenders: {
      //access: { type: 'dateFile', filename: 'log/access.log', pattern: '-yyyy-MM-dd' },
      app: { type: 'file', filename: '/var/log/app.log', maxLogSize: 10485760, numBackups: 3 },
      //errorFile: { type: 'file', filename: 'log/errors.log' },
      //errors: { type: 'logLevelFilter', level: 'error', appender: 'errorFile' }
    },
    categories: {
      default: { appenders: ['app'], level: 'info' },
    }
  });
  var logger = log4js.getLogger('file');


  module.exports =logger;