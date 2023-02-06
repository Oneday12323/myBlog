//分类表的增删查改
//1.引入express
const express = require("express");
//2.引入路由
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); //node uuid 用于生成token
//3.引入数据库
const { db, genid } = require("../db/Dbutils");

//列表接口
//1.添加接口
//2.修改接口
//3.删除接口

//1.添加接口
router.post("/_token/add", async (req, res) => {
  //分析：什么数据需要前端来传入
  /* 
        1.id都是由服务端来生成的
        2.分类列表里面的这个id是和博客列表里的category_id一致的，博客列表通过它来进行分类
    */
  let { name } = req.body;
  const insert_sql = "INSERT INTO `category` (`id`,`name`) VALUES (?,?)";
  let { err, rows } = await db.async.run(insert_sql, [genid.NextId(), name]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "添加成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "添加失败",
    });
  }
});

//2.修改接口
router.put("/_token/update", async (req, res) => {
  let { id, name } = req.body;
  const update_sql = "UPDATE `category` SET `name`= ? WHERE `id` = ? ";
  let { err, rows } = await db.async.run(update_sql, [name, id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "修改成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "修改失败",
    });
  }
});

//3.删除接口 /category/_token/delete?id=xxx
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id;
  const delete_sql = "DELETE FROM `category`  WHERE `id` = ? ";
  let { err, rows } = await db.async.run(delete_sql, [id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "删除失败",
    });
  }
});

//列表接口
router.get("/list", async (req, res) => {
  const search_sql = "SELECT * FROM `category`";

  let { err, rows } = await db.async.all(search_sql, []);

  if (err == null && rows.length > 0) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

//导出路由
module.exports = router;
