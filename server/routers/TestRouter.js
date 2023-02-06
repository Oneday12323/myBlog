//1.引入express
const express = require('express');
//2.引入路由
const router = express.Router();
//3.引入数据库
const {db,genid} = require('../db/Dbutils')

router.get('/test',async(req,res)=>{
    //查询数据库
    /* db.all('select * from `admin`',[],(err,rows)=>{
        console.log(rows);
    }) */
    //异步写法 直接调用封装的Promise
    /* db.async.all("select * from `admin`",[]).then((res)=>{
        console.log(res)
    })
 */
let out = await db.async.all("select * from `admin`",[])
    res.send({
        id:genid.NextId(),
        out //相当于out:out 键值对
    })
})



//导出路由
module.exports = router