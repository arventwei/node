"use strict";

const common = require("./../../common");

const redisHelper = common.redisHelper;
const dbHelper = common.dbHelper;
const redisSub = common.redisSub;
const config = common.config;
const logger = common.logger;
const misc = common.misc;

const async = require("async");
const _ = require('underscore');


function system_login(req, res, next) {
    var name = misc.trim(req.body.name);
    var password = sha1(misc.trim(req.body.password));
  
    var user_data = null;
  
    async.waterfall(
      [
        function(callback) {
          dbHelper.query("system_user", { name: name, pwd: password }, callback);
        }
      ],
      function(error, result) {
        if (result != null && result.length > 0) {
          res.send({ code: 0 });
        } else {
          res.send({ code: 1 });
        }
      }
    );
    //res.send('hello dmin');
  }

module.exports = function(router, regVenderPermission) {
    router.use("/admin/system/login/", system_login);
  
    
  };