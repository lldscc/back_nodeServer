const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtconfig = require('../jwt_config/index')

/**
 * 注册处理模块
 */
// req:request 前端传来的数据；res:response 后端返回的数据
exports.register = (req, res) => {
  const reginfo = req.body
  // 1.数据是否为空
  if (!reginfo.account || !reginfo.password) {
    res.send({
      code: 1,
      message: '账号或者密码不能为空'
    })
  }
  // 2.数据是否在数据库
  const sql = 'select * from users where account = ?'
  // 第一个参数：sql,第二个参数：参数,第三个参数：处理结果 
  db.query(sql, reginfo.account, (err, results) => {
    if(err) return res.cc(err)
    if (results && results.length > 0) return res.cc('账号已存在!')
    // 3.符合，中间件bcrypt对密码加密
    reginfo.password = bcrypt.hashSync(reginfo.password, 10)
    // 4.存储到数据库
    const sql1 = 'insert into users set ?'
    const identity = '用户'
    const create_time = new Date()
    db.query(sql1, {
      account: reginfo.account,
      password: reginfo.password,
      identity,
      create_time,
      status: 0
    }, (err, results) => {
      //插入失败 没有影响行数
      if (!results || results.affectedRows !== 1) {
        if(err) return res.cc(err)
        return res.cc('注册失败,请重试!')
      }
      //插入成功
      res.send({
        code: 0,
        message: '注册成功'
      })
    })
  })
}


/**
 * 登陆处理模块
 */
exports.login = (req, res) => {
  const loginfo = req.body
  // 1.数据库有没有数据
  const sql = 'select * from users where account = ?'
  db.query(sql,loginfo.account,(err,results)=>{
    // 数据库断开的失败处理
    if(err) return res.cc(err)
    //数据库查询失败处理
    if(results.length !==1) return res.cc('用户不存在!')
    // 2.解密比较
    const compareResult = bcrypt.compareSync(loginfo.password,results[0].password)
    if(!compareResult){
      return res.cc('密码错误!')
    }
    // 3.账号冻结处理
    if(results[0].status ==1){
      return res.cc('账号已冻结!')
    }
    // 4.返回token
    const user = {
      ...results[0],
      password:'',
      imageUrl:'',
      creat_time:'',
      update_time:''
    }

    //生成Token 
    const tokenStr = jwt.sign(
        user,
        jwtconfig.jwtSecretkey,
        {expiresIn:jwtconfig.expiresIn}
    )
    
    res.send({
      code:0,
      message:'登录成功',
      token:'Bearer '+tokenStr,
    })
  })
}