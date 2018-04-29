/**
 * Created by XK-WXD on 2016/8/11.
 */
"use strict";

var redisHelper = require('./redis_helper');
var fs = require("fs");
var path = require("path");

var crypto = require("crypto");
//mapData = require('./mapData'),

var async = require("async");
var url = require("url");
var moment = require("moment");
var uuid = require("uuid");
var replaceall = require("replaceall");


function getDayHourTimeFromStamp(history_key, timeStatmp) {

    var moment_time = moment(timeStatmp * 1000);
    // console.log(moment_time.date() +":"+moment_time.hour());
    if (history_key == 'Hour') {
        return moment_time.date() * 24 + moment_time.hour();
    } else {
        return moment_time.date();
    }

}

function endsWith(str, suffix) {
    return str.slice(-suffix.length) === suffix
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
function getInt(value, defaultValue) {
    if (value == undefined ||value == null|| value == '') {
        if (defaultValue != null)
            return defaultValue;
        else
            return 0;
    }
    return parseInt(value);
}
function trim(str) {
    if (str == null)
        return '';
    str = str.toString();
    var charlist = ' \r\n\t;,."\'';
    return trimRight(trimLeft(str, charlist), charlist);
};

function now() {
    return Math.floor(Date.now() / 1000);
}


function getDeviceRedisKey(mac) {
    return 'device:' + mac + ':data';
}

function getDeviceRedisKeyLogin(mac) {
    return 'device:' + mac + ':login';
}
function getDeviceHistoryRedisKey(mac, prefix) {
    return 'device:' + mac + ':' + prefix;
}

function isEmpty(str) {
    if (str == null || str.length == 0) {
        return true;
    }
    return false;
}
function saveRedis(mac, jsonData, callback) {
    //console.log("saveredis:"+JSON.stringify(jsonData));
    // if (!(constData.Device.IsOnLine in jsonData)) {
    //     jsonData[constData.Device.IsOnLine] = 1;
    // }

    var dataKey = getDeviceRedisKey(mac);
    redisHelper.hmset(dataKey, jsonData, callback);
}
function loadMacText(mac_text) {
    var lines = [];
    var mac_lines = mac_text.split(/\r?\n/);

    for (var id in mac_lines) {

        var mac_line = {};
        var line = mac_lines[id];
        line = trim(line);
        if (line == '') {
            continue;
        }
        line = replaceall('\t', ' ', line);
        line = replaceall(',', ' ', line);
        line = replaceall(';', ' ', line);
        line = trim(line);

        var charA = '';
        var charB = '';
        var spacePos = line.indexOf(' ');

        if (spacePos == -1) {
            charA = trim(line);
        } else {
            charA = trim(line.substring(0, spacePos));
            charB = trim(line.substring(spacePos));
        }


        //line = line.split(/[ ,]+/);

        // if (!isEmpty(charA)) {
        //     mac_line['A'] = charA.toUpperCase();
        // }
        // if (!isEmpty(charB)) {
        //     mac_line['B'] = charB;
        // }
        if (!isEmpty(charA)) {
            lines.push(charA);
        }
    }
    return lines;
}


module.exports = {
    getDayHourTimeFromStamp:getDayHourTimeFromStamp,
    endsWith: endsWith,
    trimLeft: trimLeft,
    trimRight: trimRight,
    trim: trim,
    now:now,
    getInt:getInt,
    getDeviceRedisKey:getDeviceRedisKey,
    getDeviceRedisKeyLogin:getDeviceRedisKeyLogin,
    getDeviceHistoryRedisKey:getDeviceHistoryRedisKey,
    loadMacText: loadMacText,
    isEmpty: isEmpty,
    saveRedis:saveRedis,

}