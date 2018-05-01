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


function get_device_count(req, res, next) {

  var query_condition = {};
  if (req.query['mac'] != null && req.query['mac'].length>0){
    var mac = misc.trim(req.query.mac);
    query_condition["like_mac"] = mac;
  }
  if (req.query['company_id'] != null ) {
   // var mac = misc.trim(req.body.company_id);
    query_condition["company_id"] = req.query['company_id'];
  }
  if (req.query['branch_id'] != null) {
    // var mac = misc.trim(req.body.company_id);
    query_condition["branch_id"] = req.query['branch_id'];
  }
  if (req.query['product_id'] != null) {
    // var mac = misc.trim(req.body.company_id);
    query_condition["product_id"] = req.query['product_id'];
  }
    //var password = sha1(misc.trim(req.body.password));
  
    //  var user_data =null;
    
    // if (mac != null && mac.length > 0) {
     
    // }
    var ret_val = {
      total: 0
    };
  
    async.waterfall(
      [
        function(callback) {
          dbHelper.count("device", query_condition, callback);
        }
      ],
      function(error, result) {
        ret_val.total = result;
  
        res.send(ret_val);
      }
    );
    //res.send('hello dmin');
  }


  
function get_device_list(req, res, next) {
    var mac = misc.trim(req.body.mac);
    var begin_index = misc.getInt(req.body.begin_index);
    var end_index = misc.getInt(req.body.end_index);
    var count = end_index - begin_index;
  
    //  var user_data =null;
    var query_condition = {};
    if (mac != null && mac.length > 0) {
      query_condition["like_mac"] = mac;
    }
    if(count>0){
      query_condition["Limit"] = begin_index + "," + count;    
  }
    query_condition["OrderBy"] = 'mac';
    var ret_val = {
      list: []
    };
  
    async.waterfall(
      [
        function(callback) {
          dbHelper.queryLeftJoin("device",
          [
            {table:'product',show:['name as product_name'], as:'pd',conditions: ['pd.id=device.product_id']}
          ] ,query_condition,null, callback);
        },function(data,callback){
          
          async.mapSeries(data,function(device_data,callback){
            var key = misc.getDeviceRedisKey(device_data.mac);
            redisHelper.hgetall(key,function(error,redis_data){
              ret_val.list.push(_.extend(device_data,redis_data));
              callback(null,null);
            })
          },callback)
        }
      ],
      function(error, result) {
        //ret_val.list = result;
        res.send(ret_val);
      }
    );
  }
  

  function device_create(req, res, next) {
    var product_id = misc.trim(req.body.product_id);
    var wifi_type = misc.trim(req.body.wifi_type);
    var mac_list = misc.trim(req.body.mac_list);
  
      //var password = sha1(misc.trim(req.body.password));
    
      //  var user_data =null;
      // var query_condition = {};
      // if (mac != null && mac.length > 0) {
      //   query_condition["like_mac"] = mac;
      // }
    var macs = misc.loadMacText(mac_list);
      var ret_val = {
          code: 0
        };
    
      async.waterfall(
        [
          function(callback) {
  
  
            async.mapSeries(macs,function(mac,callback){
              dbHelper.insert("device", {
                mac:mac,
                version:'0.0.0.0',
                product_id:product_id,
                wifi_type:wifi_type,
                is_online:0,
                create_time:misc.now(),
                
              }, callback);
            },callback);
            //dbHelper.insert("device", query_condition, callback);
          }
        ],
        function(error, result) {
          if(error==null){
              ret_val.code = 0;
          }else{
              ret_val.code = error;
          }
    
          res.send(ret_val);
        }
      );
      //res.send('hello dmin');
    }

module.exports = function(router, regVenderPermission) {
    //router.use("/admin/login/", login);
    router.use("/admin/get_device_count/", get_device_count);
    //router.use("/admin/get_product_count/", get_product_count);
    //router.use("/admin/get_version_count/", get_version_count);
    router.use("/admin/get_device_list/", get_device_list);
    //router.use("/admin/get_product_list/", get_product_list);
    //router.use("/admin/get_version_list/", get_version_list);
    router.use("/admin/device_create/", device_create);
    //router.use("/admin/product_create/", product_create);
    //router.use("/admin/version_create/", version_create);
    
  };