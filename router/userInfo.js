/**
 * 用户信息模块
 */
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const {changeUserInfo_limit, changePassword_limit }  = require('../limit/user.js')
const userInfoHandle = require('../router_handle/userInfo')

// 上传头像
router.post('/uploadAvatar', userInfoHandle.uploadAvatar)

// 绑定账号
router.post('/bindAccount', userInfoHandle.bindAccount)

// 获取用户信息
router.get('/userinfo', userInfoHandle.userinfo)

// 修改用户信息
router.post('/changeUserInfo', expressJoi(changeUserInfo_limit), userInfoHandle.changeUserInfo)

// 修改密码
router.post('/changePassword', expressJoi(changePassword_limit), userInfoHandle.changePassword)

module.exports = router
