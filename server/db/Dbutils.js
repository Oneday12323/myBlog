//连接数据库
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const GenId = require('../utils/SnowFlake'); //雪花ID

var db = new sqlite3.Database(path.join(__dirname,'blog.sqlite3'));
const genid = new GenId({WorkerId:1}); //好几台服务器 每一台服务器都给一个机器码，这样每台服务器创建的时候就不会有id的重复
//要写多个路由的时候没有必要每个页面都去引一次雪花id

//为了防止在数据库查找数据不停回调，在这里将all和run方法封装成Promise
db.async = {}

db.async.all=(sql,params)=>{  //sql 是sql语句
    return new Promise((resolve,reject)=>{
        db.all(sql,params,(err,rows)=>{
            resolve({err,rows})
        })
    })
}
db.async.run=(sql,params)=>{
    return new Promise((resolve,reject)=>{
        db.run(sql,params,(err,rows)=>{
            resolve({err,rows})
        })
    })
}

module.exports={db,genid};