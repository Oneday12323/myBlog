//博客编辑器部分有上传图片的功能
const express = require("express");
const router = express.Router();
const fs = require("fs")
const {db,genid} = require("../db/Dbutils")

router.post("/rich_editor_upload",async (req,res)=>{
    if(!req.files){
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
        return;
    }

    let files = req.files;
    let ret_files = []; //用来存储要返回的文件

    for(let file of files){
        //获取文件的名字后缀 从最后一个点往后查找
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf("."+1)) //获取文件的原名字
        //随机文件名字
        let  file_name = genid.NextId()+"."+file_ext

        //修改文件 加 移动文件
        //程序运行的目录的路径
        fs.renameSync(process.cwd()+"/public/upload/temp/"+file.filename,process.cwd()+"/public/upload/"+ file_name);
        ret_files.push("/upload/"+file_name) //保存文件名字

        res.send(
            {
                "errno": 0, // 注意：值是数字，不能是字符串
                "data": {
                    "url": ret_files[0], // 图片 src ，必须
                }
            }
        )
    }
})

module.exports=router