/**
 * 登陆注册模块
 */
const express = require('express')
const router = express.Router()

// 处理模块
const loginHandle = require('../router_handle/login')
const Joi = require('joi')
const expressJoi = require('@escook/express-joi')
const {login_limit} = require('../limit/login')

router.post('/register',expressJoi(login_limit),loginHandle.register) //注册
router.post('/login',expressJoi(login_limit),loginHandle.login) //登录

module.exports = router