const mysql = require('mysql')

const db = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'node_vue'
})

module.exports = db