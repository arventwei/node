/**
 * Created by will on 16/8/6.
 */
'use strict';

var fs = require("fs"),
    path = require("path"),
    //redis = require('redis'),
    //common = require('./../common'),
    //logger = common.logger,
    
    
//    config = require('./config.json').config,
    async = require('async');

var cfg = require('./config.json');
var config = cfg.config;


var Redis = require('ioredis');

function RedisSubPub() {

    this.sub = null;
    this.pub = null;

    this.event_handler = {};
}

var redisSubPub = new RedisSubPub();
/**
 * 初始化 Redis服务器，包括断线重连
 * @param callback
 */
RedisSubPub.prototype.init = function(callback) {
    //var deferred = Q.defer();

    callback = callback || function() {};

    if (this.sub != null && this.pub != null) {
        return callback(null, 0);
    }


    var options = {
        port: config.redis_port, // Redis port
        host: config.redis_host, // Redis host
        //     family: 4,           // 4 (IPv4) or 6 (IPv6)
        //   password: 'auth',
        db: config.redis_db,
        retryStrategy: function(times) {
            var delay = Math.min(times * 2, 2000);
            return delay;
        }
    };

    if (config.redis_auth != '') {
        options['password'] = config.redis_auth;
    }

    this.sub = new Redis(options);
    this.pub = new Redis(options);

    var self = this;


    self.sub.on('message', function(channel, message) {
        // Receive message Hello world! from channel news
        // Receive message Hello again! from channel music
        if (self.event_handler[channel] != null) {
            self.event_handler[channel](JSON.parse(message));
        }
    });

    callback(null, 0);

}

function subscribeEvent(self, name) {
    //var self = this;
    RedisSubPub.prototype['sub_' + name] = function(callback) {
        callback = callback || function() {};
        // var self = this;
        self.event_handler[name] = callback;
        self.sub.subscribe(name, function(err, count) {});
    }
    RedisSubPub.prototype['pub_' + name] = function(param) {
        //  var self = this;
        if (param.self_invoke != null && self.event_handler[name] != null) {
            return self.event_handler[name](param);
        }
        self.pub.publish(name, JSON.stringify(param));
    }
}

subscribeEvent(redisSubPub, 'deviceOnOff');
subscribeEvent(redisSubPub, 'deviceUpgrade');
subscribeEvent(redisSubPub, 'weakUpDevice');



module.exports = redisSubPub;