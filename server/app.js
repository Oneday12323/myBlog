/* 
安装几个模块
multer 专门处理上传功能的一个中间件
sqlite3 服务端要有数据库  轻量级数据库 不需要安装，只要有个管理软件就可以了，很方便移植整套服务端的代码
uuid 生成几乎不重复的id  --生成一些唯一的标志 比如token

    会根据时间戳 进行算法 服务器的标志生成id
    效率较高，不会重复
*/
/* 
1.到跨域请求这里查看是否可以跨域
2.解析里面的内容
3.解析上传
category里面的id会和blog里面的category_id一致，这样就可以把两个数据表关联起来
写一个公共连接数据库的类，方便后面直接引入使用
*/
const express = require("express");
const multer = require("multer");
const path = require("path");
//实例化
const app = express();

const { db, genid } = require("./db/Dbutils");
//定义一个端口
const port = 8080;

//3.跨域请求
app.use(function (req, res, next) {
  //设置允许跨域的域名
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "*"); //*代表全部头都可以被接受
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  //让options尝试请求快速结束
  if (res.method == "OPTIONS") res.sendStatus(200);
  else next();
});

//2.前后端的交互通过json来完成
app.use(express.json()); //中间件尽可能往上写，应该写在路由的前面
const update = multer({
  dest: "./public/upload/temp",
});
app.use(update.any()); //update.any()允许所有接口有上传这个功能
//指定静态资源路径
app.use(express.static(path.join(__dirname, "public")));

let ADMIN_TOKEN_PATH = "/_token";
//每一个接口访问之前，都进来这里做判断
app.all("*", async (req, res, next) => {
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    //接口校验
    let { token } = req.headers;
    console.log(token);

    let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?";
    let adminResult = await db.async.all(admin_token_sql, token);
    if (adminResult.err != null || adminResult.rows.length == 0) {
      res.send({
        code: 403,
        msg: "请先登录",
      });
      return;
    } else {
      next();
    }
  } else {
    next();
  }
});

//注册路由
app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouters"));
app.use("/category", require("./routers/CategoryRouter"));
app.use("/blog", require("./routers/BlogRouter"));
app.use("/upload", require("./routers/UploadRouter"));

//写一个hello world接口
app.get("/", (req, res) => {
  res.send("helloworld");
});

//
app.listen(port, () => {
  console.log(`启动成功:http://localhost:${port}`);
});
