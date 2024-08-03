# RESTful API规范
{
    code:number
    message: string
    data:any

}
code :业务状态码 
    0: 成功
    1: 错误
    401: token过期
    402: token无效

## 登录注册
需要的中间件：
1. joi:对数据进行限制的中间件
2. brcyptjs:加密密码的中间件
3. jsonwebtoken:生成token的中件件
4. express-jwt:解析token的中间件

# 上传头像
1. multer 
2. crypto uuid

???
没有用到express-jwt token 过期？