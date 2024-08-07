const db = require('../db/index')
const jwt = require('jsonwebtoken')
const jwtconfig = require('../jwt_config/index');
const crypto = require('crypto') // 生成uuid
const bcrypt = require('bcryptjs');
const fs = require('fs') // 处理文件

/**
 * 上传头像
 * @param {*} req {files：{filename, originalname}}
 */
exports.uploadAvatar = (req, res) => {
	const onlyId = crypto.randomUUID() 	// 生成唯一标识
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
 * @param {*} req {account, onlyId, url}
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
 * @param {*} req {token}
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
 * @param {*} req {id, name, sex, email, identity, department}
 */
exports.changeUserInfo = (req, res) =>{
  // 解析token 获取用户id
  const token = req.headers.authorization.split(' ')[1]
  const { id } = jwt.verify(token, jwtconfig.jwtSecretkey)
  const {name, sex, email, identity, department } = req.body

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
 */
exports.changePassword = (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const { id } = jwt.verify(token, jwtconfig.jwtSecretkey)
  const {oldPassword, newPassword} = req.body
  // console.log(id, oldPassword, newPassword)
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

/**
 * 忘记密码-修改密码
 * TODO待实现: 一般是通过邮箱找回密码, 学到邮箱验证后再实现
 * 通过用户名查询email 与请求的email是否一致，一致则根据用户名(可以更改成id 用户名不重复应该不影响)修改密码
 * @param {*} req {account, email, newPassword}
 */
exports.forgetPasswrod = (req, res) => {
  const {account, email, newPassword} = req.body
  const sql = 'select email from users where account = ?' // 根据用户名查询表中email
  db.query(sql, account, (err,result) =>{
    if(err) return res.cc(err)
    console.log('result',result)
    if(result.length === 0) {
      res.send({
        code: 1,
        message: '用户不存在！'
      })
    }
    if(result[0].email !== email){
      res.send({
        code: 1,
        message: '邮箱错误！'
      })
    }
    if(result[0].email == email){
      const newPasswordHash = bcrypt.hashSync(newPassword, 10) // 加密新密码
      const sql1 = 'update users set password = ? where account = ?' // 修改密码
      db.query(sql1, [newPasswordHash, account], (err,result) =>{
        if(err) return res.cc(err)
        res.send({
          code: 0,
          message: '修改成功'
        })
      })
    }
  })
}