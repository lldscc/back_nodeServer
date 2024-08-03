const joi = require('joi')

const id = joi.required()
const account = joi.string()
const name = joi.string().pattern(/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/).required()
const email = joi.string().pattern(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/).required()
const sex = joi.string()
const identity = joi.string()
const department = joi.string()
const oldPassword = joi.string().pattern(/^(?![0-9]+$)[a-zA-Z0-9]{1,50}$/).min(6).max(12).required()
const newPassword = joi.string().pattern(/^(?![0-9]+$)[a-zA-Z0-9]{1,50}$/).min(6).max(12).required()

// 修改用户信息的限制条件
exports.changeUserInfo_limit = {
    body: {
        id,
        name,
        email,
        sex,
        identity,
        department
    }    
}

// 修改密码的限制条件
exports.changePassword_limit = {
    body: {
        id,
        oldPassword,
        newPassword
    }    
}

// 忘记密码的限制条件
exports.forgetPassword_limit = {
    body: {
        account,
        email,
        newPassword
    }    
}