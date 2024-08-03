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

// 获取用户个人信息
// 第一种方法：通过jsonwebtoken 解析出token id 根据id从数据库查询个人信息
// 第二种方法: app.js 使用express-jwt 解析的用户信息保存到req.anth中
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