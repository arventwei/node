'use strict';



const express = require('express');
var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//var favicon = require('serve-favicon');
var session = require('express-session');
//var async = require('async');
var path = require('path');


const app = express();


app.set('views', path.join(__dirname, 'web', 'views'));
app.set('view engine', 'ejs');


//app.use(favicon(path.join(__dirname, 'web','public', 'favicon.ico')));

//var RedisStore = require('connect-redis')(session);
//app.use(cookieParser());

var MemoryStore = require('session-memory-store')(session);

app.use(cookieParser());

app.use(session({
    name: 'memorysession',
    secret: 'fec7e087-49a5-4694-87b8-5c5c2a07ff4c',
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore({})
}));

// app.use(session({
//     secret: 'fec7e087-49a5-4694-87b8-5c5c2a07ff4c',
//     store: new RedisStore({
//         host: config.redis_host,
//         port: config.redis_port,
//         pass: config.redis_auth,
//         db: config.redis_db,
//         ttl: 7200,

//     }),
//     resave: true,
//     saveUninitialized: true
// }));

app.use(express.static(path.join(__dirname, 'public')));


//app.use(bodyParser.json({ limit: '50mb' }));
//app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));


// Constants



const HOST = '0.0.0.0';
const PORT = 80;
app.listen(PORT, HOST);
//logger.info(`Running on http://${HOST}:${PORT}`);

// App

//app.use('/', require('./web/router/index'));

// async.waterfall(
//     [
//         function (callback) {
//             dbHelper.init(callback);
//         },
//         function (data, callback) {
//             redisHelper.init(callback);
//         },
//         function (data, callback) {
//             redisSub.init(callback);
//         },
//     ], function (error, result) {
//         const HOST = '0.0.0.0';
//         app.listen(config.port, HOST);
//         logger.info(`Running on http://${HOST}:${config.web_port}`);
//     }
// )
