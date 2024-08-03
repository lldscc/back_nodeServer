# 接口模块
## 登录注册
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

# 疑问/优化
1. 没有用到express-jwt token 过期？
2. 没有再joi 的字段 请求也会被拦截吗

# 最后
学习书写node后端开发,应该可以很好的锻炼js的语法吧,学习完这个项目,希望可以找一个ts的node开发来学习学习.书写node时,没有很好的报错提示,只能自己一点点找,不知道什么情况。