'use strict';
var express = require('express');
var router = express.Router();

//require('./api')(router);
require('./admin/device')(router);
require('./admin/branch')(router);
require('./admin/company')(router);
require('./admin/wechat')(router);
require('./admin/product')(router);
require('./admin/firmware')(router);
require('./admin/login')(router);



module.exports = router;