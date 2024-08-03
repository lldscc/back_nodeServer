/**
 * 用户信息模块
 */
const express = require('express')
const router = express.Router()
const userInfoHandle = require('../router_handle/userInfo')
const expressJoi = require('@escook/express-joi')

// 上传头像
router.post('/uploadAvatar',userInfoHandle.uploadAvatar)

// 获取用户信息
router.get('/userinfo',userInfoHandle.userinfo)


module.exports = router
