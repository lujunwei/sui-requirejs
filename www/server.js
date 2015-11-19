var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');

//创建express实例
var app = express();

app.use(express.static(path.resolve('.')));

//index page
app.get('/', function(req, res) {
	res.redirect('./demos.html');
});

app.listen(process.env.PORT || 3330);

console.log('服务器已启动，http://localhost:' + (process.env.PORT || 3330));