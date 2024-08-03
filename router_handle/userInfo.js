const db = require('../db/index')
const jwt = require('jsonwebtoken')
const jwtconfig = require('../jwt_config/index');
const crypto = require('crypto') // 生成uuid
const bcrypt = require('bcryptjs');
const fs = require('fs') // 处理文件

/**
 * 上传头像
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadAvatar = (req, res) => {
	// 生成唯一标识
	const onlyId = crypto.randomUUID()
	let oldName = req.files[0].filename;
	let newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf8')
	fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName)
	const sql = 'insert into image set ?'
	db.query(sql, {
		image_url: `http://127.0.0.1:3000/upload/${newName}`,
		onlyId
	}, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			code: 0,
			onlyId,
			url: 'http://127.0.0.1:3000/upload/' + newName
		})
	})
}

/**
 * 头像绑定账号
 * @param  req 
 */
exports.bindAccount = (req, res) =>{
  const {account, onlyId, url} = req.body
  console.log(account,onlyId,url);
  const sql = 'update image set account = ? where onlyId = ?' // 通过onlyId绑定账号 更新image表
  db.query(sql,[account, onlyId], (err,results) =>{
    if (err) return res.cc(err)
    if (results.affectedRows  == 1){
      const sql1 = 'update users set image_url = ? where account = ?' // 通过账号绑定头像 更新users表
      db.query(sql1,[url, account], (err,result) =>{
          if (err) return res.cc(err)
          res.send({
            code: 0,
            message: '修改成功'
          })
      })
    }else{
      res.cc(err)
    }
  })
}

/**
 * 获取个人信息
 * 第一种方法：通过jsonwebtoken 解析出token id 根据id从数据库查询个人信息
 * 第二种方法: app.js 使用express-jwt 解析的用户信息保存到req.anth中
 * @param {*} req 
 * @param {*} res 
 */
exports.userinfo = (req, res) => {
  // 解析token 获取用户id
  const token = req.headers.authorization.split(' ')[1]
  const { id } = jwt.verify(token, jwtconfig.jwtSecretkey)
  // console.log(req.auth); //express-jwt

  // 根据id查询用户信息
  const sql = 'select * from users where id = ?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 0,
      // user:req.auth,
      data: {
        userInfo: results[0]
      }
    })
  })
}

/**
 * 修改个人信息
 * 根据id修改信息
 * TODO 优化：动态参数 非空判断？？
 * @param {*} req 
 * @param {*} res 
 */
exports.changeUserInfo = (req, res) =>{
  const {id, name, sex, email, identity, department } = req.body
  const sql = 'update users set name = ?, sex = ?, email = ?, identity = ?, department = ? where id = ?';
  db.query(sql, [name, sex, email, identity, department, id], (err, result) =>{
    if(err) return res.cc(err)
    res.send({
      code: 0,
      message: '修改成功！'
    })
  })
}

/**
 * 修改密码
 * 通过id查询旧密码，对比新密码与旧密码是否一致，一致则修改密码
 * @param {*} req {id, oldPassword, newPassword} 
 * @param {*} res 
 */
exports.changePassword = (req, res) => {
  const {id, oldPassword, newPassword} = req.body
  const sql = 'select password from users where id = ?'
  db.query(sql, id, (err,result) =>{
    if(err) return res.cc(err)
    if (result.length === 0) {
      res.send({
        code: 1,
        message: '用户不存在！'
      })
    }
    // 使用bcrypt.compareSync方法 比较密码是否与数据库表一致
    const compareResult  = bcrypt.compareSync(oldPassword,result[0].password)
    if(!compareResult){
      res.send({
        code: 1,
        message: '旧密码错误！'
      })
    }
    // 一致 修改密码(bcrypt.hashSync方法加密新密码 更新users表)
    const newPasswordHash = bcrypt.hashSync(newPassword, 10)
    const sql1 = 'update users set password = ? where id = ?'
    db.query(sql1, [newPasswordHash, id], (err,result) =>{
      if(err) return res.cc(err)
      res.send({
        code: 0,
        message: '修改密码成功！'
      })
    })
  })
}