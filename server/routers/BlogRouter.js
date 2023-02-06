//博客表的增删查改
//1.引入express
const express = require("express");
//2.引入路由
const router = express.Router();
//3.引入数据库
const { db, genid } = require("../db/Dbutils");

//添加博客
//修改博客
//删除博客
//查询博客 分页 模糊查询 分类查询

//查询单个博客内容
router.get("/detail", async (req, res) => {
  let { id } = req.query;
  let detail_sql = "SELECT * FROM `blog` WHERE `id` = ?";
  let { err, rows } = await db.async.all(detail_sql, [id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "博客查询成功",
      rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "博客查询失败",
      err,
    });
  }
});

//1.添加博客
router.post("/_token/add", async (req, res) => {
  //需要前端来传入的数据有：
  /* 
        1.category_id
        2.title
        3.content
    */
  let id = genid.NextId();
  let create_time = new Date().getTime();
  let { category_id, title, content } = req.body;
  const insert_sql =
    "INSERT INTO `blog` (`id`,`category_id`,`title`,`content`,`create_time`) VALUES (?,?,?,?,?)";
  let { err, rows } = await db.async.run(insert_sql, [
    id,
    category_id,
    title,
    content,
    create_time,
  ]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "博客添加成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "博客添加失败",
      err,
    });
  }
});

//2.修改博客
router.put("/_token/update", async (req, res) => {
  let create_time = new Date().getTime();

  let { id, category_id, title, content } = req.body;
  const update_sql =
    "UPDATE `blog` SET `category_id` = ? ,`title` = ?,`content` = ? WHERE `id` = ?";
  let { err, rows } = await db.async.run(update_sql, [
    category_id,
    title,
    content,
    id,
  ]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "博客修改成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "博客修改失败",
      err,
    });
  }
});

//3.删除博客 /blog/delete?id=xxx
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id;
  const delete_sql = "DELETE FROM `blog`  WHERE `id` = ? ";
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

//4.查询博客
router.get("/search", async (req, res) => {
  /* 
        1.keyword 关键字 
            只要title或者content有包含这个关键字 都可以查询出来
            --传了 查询
            --没传 不查询
        2.分类id category_id
            --传了 查询
            --没传 不判断category_id
        3.同时传了keyword和category 就是并列查询
        4.分页
            --page：页数
            --pageSize：每页多少条
    */

  let { keyword, category_id, page, pageSize } = req.query;

  //进行判断
  //1.如果page不传，默认为1
  page = page == null ? 1 : page;
  //2.如果pageSize不传，默认为10
  pageSize = pageSize == null ? 10 : pageSize;
  //3.如果keyword不传，默认为空
  keyword = keyword == null ? "" : keyword;
  //4. 如果category_id不传，默认为空
  category_id = category_id == null ? 0 : category_id;

  let params = []; // ? 这里的参数
  let whereSqls = []; //sql语句
  if (category_id != 0) {
    whereSqls.push(" `category_id` = ? ");
    params.push(category_id);
  }
  if (keyword != "") {
    whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) "); //这里用模糊查询 因为title和content里面都可以查询
    params.push("%" + keyword + "%");
    params.push("%" + keyword + "%"); //因为有两个参数，所以要push两遍
  }

  //组合查询条件
  let whereSqlStr = "";
  if (whereSqls.length > 0) {
    whereSqlStr = " WHERE " + whereSqls.join(" AND ");
  }

  //查询分页内容
  //ORDER BY `create_time` DESC根据创建时间进行排序, LIMIT ?,?用来做分页使用
  let searchSql =
    "SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog` " +
    whereSqlStr +
    " ORDER BY `create_time` DESC LIMIT ?,? ";
  let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize]);

  //总数，一共多少条，分成多少页
  let searchCount = "SELECT count(*)  AS count FROM `blog` " + whereSqlStr;
  let searchCountParams = params;

  let searchResult = await db.async.all(searchSql, searchSqlParams);
  let countResult = await db.async.all(searchCount, searchCountParams);

  console.log(countResult);
  if (searchResult.err == null && countResult.err == null) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: {
        keyword,
        category_id,
        page,
        pageSize,
        rows: searchResult.rows,
        //count:countResult.rows[0]["count(*)"]
        count: countResult.rows[0].count,
      },
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
