# sui-requirejs
基于sui+requirejs+gulp 以sui的组件为基础快速搭建工程


目录说明

css 		所有的css文件放置

js		自己工程的js

lib 		第三方类库

pages		html文件，文件层级数必须一样，不然在hybrid app路径会存在问题

template 	放置所有html文件模板，基于gulp生成pages文件夹，建议开发的时候使用gulp watch该目录的变化，直接生成pages


js写法示例，amd规范

	define([], function() {
	  return View.extend({
	  	events: {
	      "click #login": "onLogin",
	      "click #logout": "onLogout"
	    },
	    render: function() {	//初始化方法callback

	    },
	    remove: function() {	//退出页面callback

	    },
	    onLogin: function() {	//点击#login的回调

	    },
	    onLogout: function() {	//点击#logout的回调

	    }
		});
	});

html写法示例 需要在.page 添加data-view="{{js}}"	js为绑定js文件的require路径

	<div class="page page-current" id="main-index" data-view="js/demos">
	</div>

如果js文件路径出现问题，请检查sui-requirejs的路径配置

请尽量启用node服务器来跑本demo，在www或者dist目录启用node步骤 npm install 如果有express和http-proxynode模块依赖可忽略，然后node server.js，如果无法启动请检查node模块依赖或者服务器端口
