
'use strict';



module.exports.redisHelper = require('./redis_helper');
module.exports.dbHelper = require('./db_helper');
module.exports.redisSub = require('./redis_sub');
module.exports.misc = require('./misc');
module.exports.logger = require('./logger');
var cfg = require('./config.json');

module.exports.config =cfg.config;

module.exports.config.debug = cfg.debug;

