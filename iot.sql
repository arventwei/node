/*
 Navicat Premium Data Transfer

 Source Server         : xf_node
 Source Server Type    : MySQL
 Source Server Version : 50722
 Source Host           : 106.14.240.3
 Source Database       : iot

 Target Server Type    : MySQL
 Target Server Version : 50722
 File Encoding         : utf-8

 Date: 05/01/2018 23:34:13 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `branch`
-- ----------------------------
DROP TABLE IF EXISTS `branch`;
CREATE TABLE `branch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `company`
-- ----------------------------
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `wx_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `company_user`
-- ----------------------------
DROP TABLE IF EXISTS `company_user`;
CREATE TABLE `company_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) DEFAULT NULL,
  `login_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `menu` varchar(255) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `device`
-- ----------------------------
DROP TABLE IF EXISTS `device`;
CREATE TABLE `device` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deviceid` char(50) DEFAULT NULL,
  `mac` varchar(255) DEFAULT NULL,
  `imei` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `firm_version` varchar(255) DEFAULT NULL,
  `driver_version` varchar(255) DEFAULT NULL,
  `firmware_id` int(11) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `wx_deviceid` varchar(255) DEFAULT NULL,
  `wx_qrticket` varchar(255) DEFAULT NULL,
  `wx_devicetype` varchar(255) DEFAULT NULL,
  `city` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `wx_id` int(11) DEFAULT NULL,
  `filter1_time` int(11) DEFAULT NULL,
  `filter2_time` int(11) DEFAULT NULL,
  `filter3_time` int(11) DEFAULT NULL,
  `work_time` int(11) DEFAULT NULL,
  `run_time` int(11) DEFAULT NULL,
  `filter_percent` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mac` (`mac`),
  KEY `imei` (`imei`),
  KEY `company_id` (`company_id`),
  KEY `branch_id` (`branch_id`),
  KEY `name` (`name`),
  KEY `wx_deviceid` (`wx_deviceid`),
  KEY `deviceid` (`deviceid`),
  KEY `wx_id` (`wx_id`),
  KEY `wx_qrticket` (`wx_qrticket`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `device_bind`
-- ----------------------------
DROP TABLE IF EXISTS `device_bind`;
CREATE TABLE `device_bind` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT NULL,
  `device_id` int(11) DEFAULT NULL,
  `is_owner` varchar(255) DEFAULT NULL,
  `bind_name` varchar(255) DEFAULT NULL,
  `is_new` tinyint(4) DEFAULT NULL,
  `guest_control` tinyint(4) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `role_id_2` (`role_id`,`device_id`),
  KEY `device_id` (`device_id`),
  KEY `device_id_2` (`device_id`,`is_owner`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `device_version`
-- ----------------------------
DROP TABLE IF EXISTS `device_version`;
CREATE TABLE `device_version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ver_no` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `ver_type` tinyint(4) DEFAULT NULL,
  `path_url` varchar(255) DEFAULT NULL,
  `md5_sum` varchar(255) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `firmware_id` int(11) DEFAULT NULL,
  `enable` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `firmware`
-- ----------------------------
DROP TABLE IF EXISTS `firmware`;
CREATE TABLE `firmware` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `firmware_group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `frimware_group_id` (`firmware_group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `firmware_group`
-- ----------------------------
DROP TABLE IF EXISTS `firmware_group`;
CREATE TABLE `firmware_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `product`
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `wx_productid` int(11) DEFAULT NULL,
  `filter_time1` int(11) DEFAULT NULL,
  `filter_time2` int(11) DEFAULT NULL,
  `filter_time3` int(11) DEFAULT NULL,
  `view_file` varchar(255) DEFAULT NULL,
  `wind_speed` int(11) DEFAULT NULL,
  `connect_wifi_text` varchar(255) DEFAULT NULL,
  `product_setting` varchar(255) DEFAULT NULL,
  `page_title` varchar(255) DEFAULT NULL,
  `history_type` varchar(255) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `type_name` varchar(255) DEFAULT NULL,
  `is_sensor` tinyint(4) DEFAULT NULL,
  `firmware_group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wx_openid` varchar(255) DEFAULT NULL,
  `wx_unionid` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `headimgurl` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `city` int(11) DEFAULT NULL,
  `wx_id` int(11) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wx_openid` (`wx_openid`),
  KEY `wx_unionid` (`wx_unionid`),
  KEY `company_id` (`company_id`),
  KEY `wx_id` (`wx_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `system_user`
-- ----------------------------
DROP TABLE IF EXISTS `system_user`;
CREATE TABLE `system_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL,
  `pwd` varchar(255) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `permission` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `wx_account`
-- ----------------------------
DROP TABLE IF EXISTS `wx_account`;
CREATE TABLE `wx_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `wx_app_id` varchar(255) DEFAULT NULL,
  `wx_app_secret` varchar(255) DEFAULT NULL,
  `wx_token` varchar(255) DEFAULT NULL,
  `wx_encoding_aes_key` varchar(255) DEFAULT NULL,
  `wx_qrcode` varchar(255) DEFAULT NULL,
  `gh_id` varchar(255) DEFAULT NULL,
  `wx_menu` varchar(255) DEFAULT NULL,
  `subscribe_reply` varchar(255) DEFAULT NULL,
  `default_reply` varchar(255) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wx_app_id` (`wx_app_id`),
  KEY `wx_qrcode` (`wx_qrcode`),
  KEY `gh_id` (`gh_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
