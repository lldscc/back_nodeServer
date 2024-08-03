// const { date } = require('joi')
const db = require('../db/index')
const jwt = require('jsonwebtoken')
const jwtconfig = require('../jwt_config/index');
const { date } = require('joi');

// const bcrypt = require('bcryptjs')

// exports.uploadAvatar = (req,res) =>{
//     res.send(req.files[0])
// }

// 获取用户个人信息
// 第一种方法：通过jsonwebtoken 解析出token id 根据id从数据库查询个人信息
// 第二种方法: app.js 使用express-jwt 解析的用户信息保存到req.anth中
exports.userinfo = (req,res) =>{
    // 解析token 获取用户id
    const token = req.headers.authorization.split(' ')[1]
    const {id} = jwt.verify(token, jwtconfig.jwtSecretkey)
    // console.log(req.auth); //express-jwt

    // 根据id查询用户信息
    const sql = 'select * from users where id = ?'
    db.query(sql,id,(err,results)=>{
        if(err) return res.cc(err)
        res.send({
          code:0,
          // user:req.auth,
          data:{
            userInfo:results[0]
          }
        })
      })
}