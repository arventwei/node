/**
 * Created by XK-WXD on 2016/8/5.
 */
'use strict';
var mysql = require('mysql'),
    _ = require('underscore');
    //logger = require('./logger').www;


var cfg = require('./config.json');
var config = cfg.config;
if(cfg.debug){
    config =cfg.test;
}

var process = require('process');
//Q = require('q'),
//misc = require('./misc');


function removeLastComma(strng, lastChar) {
    var n = strng.lastIndexOf(lastChar);
    var a = strng.substring(0, n)
    return a;
}

function trimRight(str, charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return str.replace(new RegExp("[" + charlist + "]+$"), "");
};

function trimLeft(str, charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return str.replace(new RegExp("^[" + charlist + "]+"), "");
};

function trim(str) {
    if (str == null)
        return '';
    str = str.toString();
    var charlist = ' \r\n\t;,."\'';
    return trimRight(trimLeft(str, charlist), charlist);
};


function DbConnection(dbConfig) {
    this.conn = null;
    this.dbConfig = dbConfig;
    //this.dbInited = false;
    this.intervalId = null;
}

/**
 * 创建数据库连接
 * @returns {Function}
 */
// DbConnection.prototype.createHandleError = function () {

//     var self = this;
//     return function (err) {
//         if (err != null) {


//             //mysql.createConnection(dbConfig);
//             // 如果是连接断开，自动重新连接
//             if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//                 self.init();
//             }
//             //} else {
//             //console.log('Connection closed normally.'+self.dbConfig.database);
//             logger.error("db reconnecting...:" + err);
//             //}
//         }
//     }

// }
/***
 * 初始化数据库
 * @param callback
 */
DbConnection.prototype.init = function (callback) {

    callback = callback || function () { };

    var self = this;
    if (self.conn != null && self.conn.state == "authenticated") {
        return callback(null, null);
    }

    self.conn = mysql.createConnection(self.dbConfig); // Recreate the connection, since
    // the old one cannot be reused.


    self.conn.connect(function (err) {              // The server is either down
        // console.log('init :' + self.conn.threadId + " pid:" + process.pid);
        if (err) {                                     // or restarting (takes a while sometimes).
            self.conn = null;
            //logger.error('error when connecting to db:', err);
            setTimeout(function () {
                self.init();
            }, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    self.conn.on('error', function (err) {
        self.conn = null;
        //logger.error('db error', +self.conn.threadId + err + " pid:" + process.pid);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            self.init();                      // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
    if (self.intervalId != null) {
        clearInterval(self.intervalId);
    }

    self.intervalId = setInterval(function () {
        // console.log('interval select:' + self.conn.threadId + " pid:" + process.pid)
        self.queryBySql('SELECT 1', function (err, result) {
            if (err) {
                if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
                    self.init();
                }
            }
        });
    }, 5000);



    callback(null, null);
    //return defered.promise;
}

DbConnection.prototype.getConnectionState = function () {
    return "";
    //return "connection:" + this.conn._connectionQueue.length + " free:" + this.conn._freeConnections.length + " total:" + this.conn._allConnections.length;
}
/**
 *
 * @param tableName
 * @param conditions
 * @param callback
 */
DbConnection.prototype.delete = function (tableName, conditions, callback) {

    callback = callback || function () { };
    var self = this;

    var condition = '';
    for (var key in conditions) {
        condition += key + '=' + processField(conditions[key]) + ' and ';
    }
    condition = removeLastComma(condition, 'and');

    self.conn.query('DELETE FROM ' + tableName + ' WHERE ' + condition, function (err, result) {
        // console.log('dbHelper delete:'+err+result);
        callback(err, result);
    });
}
/***
 * 插入数据到表中，并且返回插入ID
 * @param tableName
 * @param values
 * @param callback
 */
DbConnection.prototype.insert = function (tableName, values, callback) {
    //var defered = Q.defer();
    callback = callback || function () { };
    var self = this;
    self.conn.query('INSERT INTO ' + tableName + ' SET ?', values, function (error, result) {
        if (error) {
            callback(error);
            //defered.reject(error);
        } else {
            callback(null, result.insertId);
            //defered.resolve(result.insertId);
            //console.log('success');
        }
    });
    //    return defered.promise;
}
DbConnection.prototype.replace = function (tableName, values, callback) {
    //var defered = Q.defer();
    var self = this;
    self.conn.query('REPLACE INTO ' + tableName + ' SET ?', values, function (error, result) {
        if (error) {
            callback(error, null);
            //defered.reject(error);
        } else {
            callback(null, result.insertId);
            //defered.resolve(result.insertId);
            //console.log('success');
        }
    });
    //    return defered.promise;
}
/***
 * 更新表数据
 * @param tableName
 * @param id
 * @param values
 * @param callback
 */
DbConnection.prototype.update = function (tableName, id, values, callback) {
    // var defered = Q.defer();

    callback = callback || function () { };
    var self = this;


    if (typeof (id) == 'object') {
        var condition = '';
        for (var key in id) {
            condition += key + '=' + processField(id[key]) + ' and ';
        }
        condition = removeLastComma(condition, 'and');
        self.conn.query('UPDATE ' + tableName + ' SET ? WHERE ' + condition, values, function (error, result) {
            callback(error, id);
        });
    } else {
        self.conn.query('UPDATE ' + tableName + ' SET ? WHERE id=' + id, values, function (error, result) {
            callback(error, id);
        });
    }


}


/***
 * 判断表是否存在
 * @param tableName
 * @param values
 * @param callback
 */
DbConnection.prototype.exist = function (tableName, values, callback) {
    // var defered = Q.defer();
    var self = this;
    var conditionVal = getCondition(values);
    var sql = 'SELECT id from ' + tableName +  conditionVal
    self.conn.query(sql, function (error, result) {
        if (error) {
            callback(error);
            //defered.reject(error);
        } else {
            if (result.length == 0) {
                callback(null, -1);

            } else {
                callback(null, result[0].id);
                //defered.resolve(result[0].id);
            }
        }
    });
    //return defered.promise;
}

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

/**
 * 处理
 * @param value
 * @returns {*}
 */
function processField(value) {
    if (isString(value)) {
        return '"' + value + '"';
    }
    return value;
}
/***
 * 由json格式返回 and 组合的条件字符串
 */
function getCondition(conditions, tableName) {
    var conditionVal = "";
    var OrderBy = '';
    var Limit = '';



    for (var fieldName in conditions) {
        var andFieldValue = "";
        var fieldValue = conditions[fieldName];
        if (fieldValue instanceof Array) {
            for (var i = 0; i < fieldValue.length; i++) {
                var subVal = fieldValue[i];
                andFieldValue += (fieldName + '=' + processField(subVal) + ' or ');
            }
            andFieldValue = trimRight(andFieldValue, ' or ');
        } else {
            if (fieldName == 'OrderBy') {
                OrderBy = ' ORDER BY ' + fieldValue;
            }
            else if (fieldName == 'Limit') {
                Limit = ' Limit ' + fieldValue;
            } else {

                var op = '=';
                if (fieldName.startsWith('lte_')) {
                    op = '<=';
                    fieldName = fieldName.substring(4);
                } else if (fieldName.startsWith('gte_')) {
                    op = '>=';
                    fieldName = fieldName.substring(4);
                } else if (fieldName.startsWith('lt_')) {
                    op = '<';
                    fieldName = fieldName.substring(3);
                } else if (fieldName.startsWith('gt_')) {
                    op = '>';
                    fieldName = fieldName.substring(3);
                } else if (fieldName.startsWith('like_')) {
                    op = ' like ';
                    fieldName = fieldName.substring(5);
                    fieldValue = '%' + fieldValue + '%';
                }
                if (tableName != null && fieldName.indexOf('.') == -1) {
                    andFieldValue = tableName + '.' + fieldName + op + processField(fieldValue);
                } else {
                    andFieldValue = fieldName + op + processField(fieldValue);
                }
            }
        }
        if (andFieldValue.length > 0) {
            conditionVal += ('(' + andFieldValue + ') and ');
        }
    }
    var conditionVal = trimRight(conditionVal, ' and ');
    if(conditionVal.length>0){
        conditionVal = ' WHERE '+conditionVal;
    }
    return conditionVal + OrderBy + Limit;

}
/***
 * 返回降序指定列的第一个
 * @param tableName
 * @param conditions
 * @param desc_col
 * @param callback
 */
DbConnection.prototype.queryTop1 = function (tableName, conditions, desc_col, max_count, callback) {
    var self = this;
    var conditionVal = getCondition(conditions);

    var sql = 'SELECT * from ' + tableName +  conditionVal + ' ORDER BY ' + desc_col + ' DESC LIMIT ' + max_count;
    //   logger.info("queryTop1:" + sql);
    self.conn.query(sql, function (error, result) {
        callback(null, result);
    });
}
DbConnection.prototype.count = function (tableName, conditions, callback) {
    var self = this;
    var conditionVal = getCondition(conditions);

    var sql = 'SELECT COUNT(*) as count from ' + tableName +conditionVal;
    // if (conditionVal.length>0){
    //     sql += ' WHERE ' + conditionVal;
    // }
     
    // console.log(sql);
    self.conn.query(sql, function (error, result) {
        if (result != null) {
            callback(error, result[0].count);
        } else {
            callback(error, 0);
        }

    });
}
/***
 * 从数据库查询数据
 * @param tableName 表名
 * 第三个参数表示，如果为空，是否强制返回错误
 * @param conditions 条件,JSON格式，如果数据是列表，表示是OR关系，如{file_name:[1,2]} 表示 file_name =1 or file_name=2
 * @param callback
 */
DbConnection.prototype.query = function (tableName, conditions, callback) {
    //var defered = Q.defer();
    callback = callback || function () { };
    var null_error = true;
    var asc_col = null;
    var desc_col = null;
    var show_col = '*';
    var call_source = null;
    var dry = false;
    if (arguments.length == 4) {
        callback = arguments[3];
        if (arguments[2].null_error != null) {
            null_error = arguments[2].null_error;
        }
        if (arguments[2].asc_col != null) {
            asc_col = arguments[2].asc_col;
        } else if (arguments[2].desc_col != null) {
            desc_col = arguments[2].desc_col;
        }
        if (arguments[2].source != null) {
            call_source = arguments[2].source;
        }
        if (arguments[2].show != null) {
            show_col = arguments[2].show.join(',');
        }
        if (arguments[2].dry != null) {
            dry = true;
        }
    }

    var self = this;
    var conditionVal = getCondition(conditions);

    var sql = 'SELECT ' + show_col + ' from ' + tableName +  conditionVal;
    if (asc_col != null) {
        sql += ' ORDER BY ' + asc_col; // + ' ASC';
    } else if (desc_col != null) {
        sql += ' ORDER BY ' + desc_col + ' DESC';
    }
    if (dry) {
        return sql;
    }
    //console.log("query:"+sql);
    self.conn.query(sql, function (error, result) {
        //if(callback!=null){

        if (error == null && result.length == 0 && null_error) {
            //var stack = new Error().stack;
            //logger.error(stack);
            callback(tableName + ' not found:' + conditionVal + (call_source || ''));
        } else {
            callback(error, result);
        }
    });
    //  return defered.promise;
}
/***
 *
 * @param table
 * @param innerJoinTables
 * {
 * table:xxx,
 * conditions:['p.id = d.product_id','rcb.chip_type=0'],
 * show:true,
 * }
 * @param callback
 */
DbConnection.prototype.queryInnerJoin = function (table, innerJoinTables, conditions, callback) {

    var self = this;

    var sql = 'SELECT ' + table + '.* '; // from '+table;
    var innerJoin = '';
    for (var i = 0; i < innerJoinTables.length; i++) {
        innerJoin += ' INNER JOIN ' + innerJoinTables[i].table + ' ' + innerJoinTables[i].as + ' ON ' + innerJoinTables[i].conditions.join(' and ');
        for (var j = 0; j < innerJoinTables[i].show.length; j++) {

            sql += ',' + innerJoinTables[i].as + '.' + innerJoinTables[i].show[j];
        }
    }
    sql += ' from ' + table;
    sql += innerJoin;

    sql += getCondition(conditions);
    // if (_.size(conditions) > 0) {
    //     sql += ' WHERE ' + getCondition(conditions);
    // }
    // logger.info("innersql:" + sql);

    self.conn.query(sql, function (err, result) {
        callback(err, result);
    });
}

DbConnection.prototype.queryLeftJoin = function (table, leftJoinTables, conditions, options, callback) {

    var self = this;

    var sql = 'SELECT ' + table + '.* '; // from '+table;
    var innerJoin = '';
    for (var i = 0; i < leftJoinTables.length; i++) {
        innerJoin += ' LEFT JOIN ' + leftJoinTables[i].table + ' ' + leftJoinTables[i].as + ' ON ' + leftJoinTables[i].conditions.join(' and ');
        for (var j = 0; j < leftJoinTables[i].show.length; j++) {

            sql += ',' + leftJoinTables[i].as + '.' + leftJoinTables[i].show[j];
        }
    }
    sql += ' from ' + table;
    sql += innerJoin;


    sql +=  getCondition(conditions, table);

    // if (_.size(conditions) > 0) {
    //     sql += ' WHERE ' + getCondition(conditions, table);
    // }

    if (options != null) {
        if (options.dry) {
            return sql;
        }
    }
    // console.log("leftjoin:"+sql);
    self.conn.query(sql, function (err, result) {
        callback(err, result);
    });
}
/***
 * 直接查询数据库
 * @param sql
 * @param callback
 */
DbConnection.prototype.queryBySql = function (sql, callback) {
    // var defered = Q.defer();
    callback = callback || function () { };
    var self = this;
    if (self.conn == null)
        return callback(null, null);

    //var sql = 'SELECT * from '+tableName+' WHERE '+ conditionVal;
    //console.log(sql);
    self.conn.query(sql, function (err, result) {
        callback(err, result);
    });
    //return defered.promise;
}

DbConnection.prototype.escape = function (str) {
    // var defered = Q.defer();
    var ret = this.conn.escape(str);

    return trim(ret);

}


var writeConnection = new DbConnection(config.writeDB);
//var readConnection = new DbConnection(config.readDB);


///cache from dbHelper
module.exports = writeConnection;