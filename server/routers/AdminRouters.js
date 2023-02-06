//1.引入express
const express = require('express');
//2.引入路由
const router = express.Router();
const {v4:uuidv4}  = require('uuid') //node uuid 用于生成token
//3.引入数据库
const {db,genid} = require('../db/Dbutils')

//1.登录
router.post('/login',async (req,res)=>{
    let {account,password} = req.body;  //req.body是前端传过来的信息
    //在数据库查询账户和密码   需要家条件where `account` = ? AND `password` = ?
    //{err,rows}就是解构的out里面的值
    let {err,rows} = await db.async  
    .all('select * from `admin` where `account` = ? AND `password` = ?',[account,password]);

    if(err==null && rows.length>0){
        

        //这里没有报错的情况下要生成一个token，然后返回给前端
        let login_token = uuidv4(); //通过uuid生成了token

        //将token上传到数据库
        let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?" 
        await db.async.run(update_token_sql,[login_token,rows[0].id]);

        //把token加入到用户信息然后返回给前端，但是不能把密码返回
        let admin_info = rows[0];
        admin_info.token = login_token;
        admin_info.password=''

        res.send({
            code:200,
            msg:'登陆成功',
            data:admin_info,
        })
    }else{
        res.send({
            code:500,
            msg:'登陆失败',
        })
    }


})


//导出路由
module.exports = router