const joi = require('joi')
// string值只能为字符串
// aLphanum值为a-zA-Zg-9
// min是最小长度max是最大长度
// required是必填项
// pattern是正则

// 账号的验证
// 只能包含字母和数字,长度必须在6到12个字符之间。
const account = joi.string().alphanum().min(6).max(12).required()

// 密码的验证
// 必须同时包含至少一个小写字母、一个大写字母和一个数字,总长度在6到12个字符之间。
const password = joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/).min(6).max(12).required()

exports.login_limit = {
  body:{
    account,password
  }
}