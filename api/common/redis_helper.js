/**
 * Created by will on 16/8/6.
 */
'use strict';

var fs = require("fs"),
    path = require("path"),
    //redis = require('redis'),
    //logger = require('./logger').www,
   // logger = require('./logger').www,
//    config = require('./config.json').config,
    async = require('async');
    //Q = require('q'),
   // db = require('./dbHelper');

var cfg = require('./config.json');
var config = cfg.config;


var Redis = require('ioredis');

function RedisHelper() {

    this.client = null;
}

RedisHelper.prototype.getCommandQueueSize = function () {
    return this.client.commandQueue.length + ":" + this.client.offlineQueue.length;
}
/**
 * 初始化 Redis服务器，包括断线重连
 * @param callback
 */
RedisHelper.prototype.init = function (callback) {
    //var deferred = Q.defer();

    callback = callback || function () { };
    var options = {
        port: config.redis_port, // Redis port
        host: config.redis_host, // Redis host
        //     family: 4,           // 4 (IPv4) or 6 (IPv6)
        //   password: 'auth',
        db: config.redis_db,
        retryStrategy: function (times) {
            var delay = Math.min(times * 2, 2000);
            return delay;
        }
    };

    if (config.redis_auth != '') {
        options['password'] = config.redis_auth;
    }

    this.client = new Redis(options)
    callback(null, 0);

}


/***
 * 查找所有符合给定模式pattern（正则表达式）的 key 。
 时间复杂度为O(N)，N为数据库里面key的数量。
 例如，Redis在一个有1百万个key的数据库里面执行一次查询需要的时间是40毫秒 。
 * @param keyName
 * @param callback
 */
RedisHelper.prototype.keys = function (keyName, callback) {
    this.client.keys(keyName, callback);
}
RedisHelper.prototype.del = function (keyName, callback) {
    callback = callback || function () { };
    this.client.del(keyName, callback);
}
/**
 *返回列表 key 中，下标为 index 的元素。
 下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。
 你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。
 如果 key 不是列表类型，返回一个错误。
 * @param keyName
 * @param index
 * @param callback
 */
RedisHelper.prototype.lindex = function (keyName, index, callback) {
    this.client.lindex(keyName, index, function (err, data) {
        callback(null, data);
    });
}
/**
 * 移除并返回列表 key 的尾元素。
 * @param keyName
 * @param callback
 * 返回值：
 列表的尾元素。
 当 key 不存在时，返回 nil
 */
RedisHelper.prototype.rpop = function (keyName, callback) {
    this.client.rpop(keyName, callback);
}
/**
 *返回列表 key 中指定区间内的元素，区间以偏移量 start 和 end 指定。
 下标(index)参数 start 和 end 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。
 你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。
 注意LRANGE命令和编程语言区间函数的区别
 假如你有一个包含一百个元素的列表，对该列表执行 LRANGE list 0 10 ，结果是一个包含11个元素的列表，这表明 stop 下标也在 LRANGE 命令的取值范围之内(闭区间)，这和某些语言的区间函数可能不一致，比如Ruby的 Range.new 、 Array#slice 和Python的 range() 函数。
 超出范围的下标
 超出范围的下标值不会引起错误。
 如果 start 下标比列表的最大下标 end ( LLEN list 减去 1 )还要大，那么 LRANGE 返回一个空列表。
 如果 stop 下标比 end 下标还要大，Redis将 stop 的值设置为 end 。
 * @param keyName
 * @param start
 * @param end
 * @param callback
 */
RedisHelper.prototype.lrange = function (keyName, start, end, callback) {
    this.client.lrange(keyName, start, end, callback);
}


RedisHelper.prototype.rpush = function (keyName, value, callback) {
    this.client.rpush(keyName, value, callback);
}

RedisHelper.prototype.lset = function (keyName, index, value, callback) {
    this.client.lset(keyName, index, value, callback);
}

/***
 *
 * @param keyName
 * @param callback
 */
RedisHelper.prototype.llen = function (keyName, callback) {
    this.client.llen(keyName, callback);
}
/***
 * 插入limitCount个元素到指定的列表中
 * @param keyName
 * @param value
 * @param limitCount
 * @param callback
 */
RedisHelper.prototype.pushList = function (keyName, value, limitCount, callback) {

    callback = callback || function () { };
    var self = this;

    async.waterfall([
        function (callback) {
            self.client.llen(keyName, function (error, count) {
                if (limitCount > 0 && count >= limitCount) {
                    //!pop left first
                    self.client.lpop(keyName, callback)
                } else {
                    callback(error, count);
                }
            });
        },
        function (data, callback) {
            self.client.rpush(keyName, value, callback);
        }


    ], callback);
    //this.client.set(keyName,value);
}

/**
 *将字符串值 value 关联到 key 。
 如果 key 已经持有其他值， SET 就覆写旧值，无视类型。
 对于某个原本带有生存时间（TTL）的键来说， 当 SET 命令成功在这个键上执行时， 这个键原有的 TTL 将被清除。
 * @param keyName
 * @param value
 */
RedisHelper.prototype.set = function (keyName, value, callback) {

    callback = callback || function () { };
    this.client.set(keyName, value, callback);
}
/**
 *返回 key 所关联的字符串值。
 如果 key 不存在那么返回特殊值 nil 。
 假如 key 储存的值不是字符串类型，返回一个错误，因为 GET 只能用于处理字符串值。
 * @param keyName
 * @param callback
 */
RedisHelper.prototype.get = function (keyName, callback) {

    this.client.get(keyName, callback);
}
/**
 *为给定 key 设置生存时间，当 key 过期时(生存时间为 0 )，它会被自动删除。
 在 Redis 中，带有生存时间的 key 被称为『易失的』(volatile)。
 * @param keyName
 * @param second
 */
RedisHelper.prototype.expire = function (keyName, second) {
    this.client.expire(keyName, second);
}
/**
 * 同时将多个 field-value (域-值)对设置到哈希表 key 中。
 此命令会覆盖哈希表中已存在的域。
 如果 key 不存在，一个空哈希表被创建并执行 HMSET 操作。
 * @param keyName
 * @param objectValue
 */
RedisHelper.prototype.hmset = function (keyName, objectValue, callback) {
    callback = callback || function () { };

    //!TODO......

    // if (keyName.indexOf('D0BAE41B572D') != -1) {
    //    logger.info('redisHelper:' + keyName + JSON.stringify(objectValue));

    //    logger.info(new Error().stack);
    // if (JSON.stringify(objectValue).length < 4) {
    //     logger.info(new Error().stack);
    // }
    //}

    this.client.hmset(keyName, objectValue, callback);
}

RedisHelper.prototype.hmget = function (keyName, keys, callback) {
    callback = callback || function () { };
    this.client.hmget(keyName, keys, callback);
}
/***
 * 对存储在指定key的数值执行原子的加1操作。
 如果指定的key不存在，那么在执行incr操作之前，会先将它的值设定为0。
 如果指定的key中存储的值不是字符串类型（fix：）或者存储的字符串类型不能表示为一个整数，
 那么执行这个命令时服务器会返回一个错误(eq:(error) ERR value is not an integer or out of range)。
 这个操作仅限于64位的有符号整型数据。
 * @param keyName
 * @param callback
 */
RedisHelper.prototype.incr = function (keyName, callback) {
    callback = callback || function () { };
    this.client.incr(keyName, callback);
}
/***
 * 返回哈希表 key 中，所有的域和值。
 在返回值里，紧跟每个域名(field name)之后是域的值(value)，所以返回值的长度是哈希表大小的两倍。
 * @param keyName
 * @param callback
 */
RedisHelper.prototype.hgetall = function (keyName, callback) {
    //var deferred = Q.defer();
    //var self = this;
    this.client.hgetall(keyName, callback);
    //   return deferred.promise.nodeify();
}


/**
 * 返回哈希表 key 中的所有域。
 */
RedisHelper.prototype.hkeys = function (keyName, callback) {
    this.client.hkeys(keyName, callback);
}

RedisHelper.prototype.hget = function (keyName, field, callback) {
    //var deferred = Q.defer();
    //var self = this;
    this.client.hget(keyName, field, callback);
    //   return deferred.promise.nodeify();
}
RedisHelper.prototype.hset = function (keyName, field, objectValue, callback) {
    callback = callback || function () { };
    this.client.hset(keyName, field, objectValue, callback);
}

RedisHelper.prototype.hincrby = function (keyName, field, callback) {
    callback = callback || function () { };
    this.client.hincrby(keyName, field, 1, callback);
}
RedisHelper.prototype.multi = function () {
    //var deferred = Q.defer();
    //var self = this;
    return this.client.multi();
    //   return deferred.promise.nodeify();
}

RedisHelper.prototype.exec = function (callback) {
    //var deferred = Q.defer();
    //var self = this;
    return this.client.exec(callback);
    //   return deferred.promise.nodeify();
}

/**
 * removeScore 表示小于改分值的元素都会被删除
 */
RedisHelper.prototype.zaddLimit = function (keyName, score, value, removeScore, callback) {
    callback = callback || function () { };
    var self = this;
    this.client.zremrangebyscore(keyName, 0, removeScore, function (error, data) {
        self.client.zadd(keyName, score, value, callback);
    });
}
RedisHelper.prototype.zrange = function (keyName, start, stop, callback) {
    callback = callback || function () { };
    this.client.zrange(keyName, start, stop, callback);
}
//ZREVRANGE
RedisHelper.prototype.zrevrange = function (keyName, start, stop, callback) {
    callback = callback || function () { };
    this.client.zrevrange(keyName, start, stop, callback);
}
/***
 * 有序集合相关函数
 * @param keyName
 * @param callback
 */
RedisHelper.prototype.zadd = function (keyName, score, data, callback) {
    callback = callback || function () { };
    this.client.zadd(keyName, score, data, callback);
}
RedisHelper.prototype.zcount = function (keyName, start, stop, callback) {
    callback = callback || function () { };
    this.client.zcount(keyName, start, stop, callback);
}

RedisHelper.prototype.zcard = function (keyName, callback) {
    callback = callback || function () { };
    this.client.zcard(keyName, callback);
}

RedisHelper.prototype.zrangebyscore = function (keyName, minscore, maxScore, callback) {
    callback = callback || function () { };
    this.client.zrangebyscore(keyName, minscore, maxScore, callback);
}

RedisHelper.prototype.zremrangebyscore = function (keyName, minscore, maxScore, callback) {
    callback = callback || function () { };
    this.client.zremrangebyscore(keyName, minscore, maxScore, callback);
}

module.exports = new RedisHelper();

//!cache