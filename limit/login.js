const joi = require('joi')

/**
 * 登录用户名的规则
 * rules 只能包含字母和数字,长度必须在6到12个字符之间。
 */
const account = joi.string().alphanum().min(6).max(12).required()

/**
 * 登录密码的规则
 * rules 必须同时包含至少一个小写字母、一个大写字母和一个数字,总长度在6到12个字符之间。
 */
const password = joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/).min(6).max(12).required()

exports.login_limit = {
  body:{
    account,password
  }
}