# 接口模块
## 登录注册
中间件：
1. joi:对数据进行限制,设置规则的中间件
    + string值只能为字符串
    + aLphanum值为a-zA-Zg-9
    + min是最小长度max是最大长度
    + required是必填项
    + pattern是正则
2. brcyptjs:加密密码的中间件
3. jsonwebtoken:生成token的中件件
4. express-jwt:解析token的中间件

## 上传头像
1. multer 
2. crypto uuid

# RESTful API规范
响应结构
```json
{
    code:number
    message: string
    data:any
}
```
code :业务状态码 
+ 0: 成功
+ 1: 错误
+ 401: token过期
+ 402: token无效

???
1. 没有用到express-jwt token 过期？
2. 没有再joi 的字段 请求也会被拦截吗