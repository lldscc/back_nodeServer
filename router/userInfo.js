/**
 * 用户信息模块
 */
const express = require('express')
const router = express.Router()
const userInfoHandle = require('../router_handle/userInfo')
const expressJoi = require('@escook/express-joi')

// 上传头像
router.post('/uploadAvatar',userInfoHandle.uploadAvatar)

// 绑定账号
router.post('/bindAccount',userInfoHandle.bindAccount)

// 获取用户信息
router.get('/userinfo',userInfoHandle.userinfo)

// 修改用户信息
router.post('/changeUserInfo', userInfoHandle.changeUserInfo)

module.exports = router
