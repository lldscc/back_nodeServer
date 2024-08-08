const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const cors = require('cors')
const jwtconfig = require('./jwt_config/index')
const {expressjwt:jwt} = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const loginRouter = require('./router/login')
const userInfoRouter = require('./router/userInfo')
const Joi = require('joi')


// ## cors中间件
app.use(cors())

// ## 解析 application/x-www-form-urlencoded true:任意值 false:数组或者字符串 、解析 application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// ## 上传文件
const multer = require('multer')
const upload = multer({dest:'./public/upload'})
app.use(upload.any())
app.use(express.static("./public"))

// ## 中间件：封装响应统一处理错误信息
app.use((req,res,next)=>{
  res.cc = (err,code = 1)=>{
    res.send({
      code,
      message:err instanceof Error ? err.message :err
    })
  }
  next()
})

// ## express-jwt 放在路由前
app.use(jwt({
  secret:jwtconfig.jwtSecretkey,algorithms:['HS256']
}).unless({
  path:[/^\/api\//]
}))

// token 过期 (拦截请求头)
app.use((req,res,next)=>{
  if(req.headers.authorization){
    const token = req.headers.authorization.split(' ')[1]
    jsonwebtoken.verify(token, jwtconfig.jwtSecretkey,(err,date) =>{
      if(err){
          send({
            code: 401,
            message: "token过期",
          })
      } 
    })
  }
  next()
})


// ## 路由
app.use('/api',loginRouter)
app.use('/user', userInfoRouter)

// ## 全局错误的中间件 不符合规则处理
app.use((err,req, res, next) => {
	if (err instanceof Joi.ValidationError){
		res.send({
			code: 1,
			message:'输入的数据不符合验证规则'
		})
	}
})

// 全局中间件
app.use((err,req,res,next)=>{
  console.log(err);
  // token 无效
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({
      code: 402,
      message: "token无效",
    });
  }
  res.status(500).send({
    code: 500,
    message: "未知的错误",
  });
})


// ## 监听3000
app.listen(3000, () => {
  console.log('listenPort', 3000);
})