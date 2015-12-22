require.config({
  baseurl: '../',
  paths: {
    zepto: '../lib/sui/js/zepto.min',
    sm: '../lib/sui/js/sm.min',
    'smExtend': '../lib/sui/js/sm-extend.min',
    view: '../js/view',
    // 'js': '../../../js',  //hybrid app使用路径
    'js': '/js'  //web server使用路径
  },
  shim: {
    'zepto': {
      exports: '$'
    },
    'sm': {
      deps: ['zepto'],
      exports: 'sm'
    },
    'smExtend': {
      deps: ['zepto', 'sm'],
      exports: 'smExtend'
    }
  },
  waitSeconds: 5,
});

require(['sui-requirejs'], function() {

});

define('sui-requirejs', ['smExtend', 'view'], function() {
  'use strict';

  var viewRequiredArr = []; //被加载过的页面数组

  var getBindName = function(currentPage) { //获取页面绑定的js路径
    var router = $.router;
    var currentPage = currentPage || (router && router.getCurrentPage());
    if (currentPage) { //页面存在
      var bindingName = currentPage.attr("data-view"); //获得js的绑定路径
      //如果没写data-view，或无值，则默认使用与此html同名的js文件，例如pages/login.html js/login.js
      if (bindingName == '.' || bindingName == '') {
        var paths = window.location.pathname;
        var splitArr = paths.split("/");
        var currentPageName = splitArr[splitArr.length - 1]
        bindingName = currentPageName.replace('.html', '');
      }
    }

    return bindingName;
  }

  var requireView = function(currentPage) { //主动require view
    require([getBindName(currentPage)], function(currentView) {

      currentView = currentView || {};
      currentView.bindName = getBindName(currentPage); //保存view
      viewRequiredArr.push(currentView);

      if (currentView && currentView.render) {
        currentView.render();
      }

      if (currentView && currentView.delegateEvents) { //绑定事件委托
        currentView.delegateEvents(currentView.events);
      }
    });
  }

  var getViewByBindName = function(bindName) { //获取view通过bindName
    var view;
    viewRequiredArr.forEach(function(viewItem) {
      if (viewItem.bindName == bindName) {
        view = viewItem;
      }
    })
    return view;
  }
  var viewInited = function(currentPage) { //view初始化
    var bindingName = getBindName(currentPage);
    var view = getViewByBindName(bindingName);

    if (view) { //requirejs已经加载过了
      // 重新绑定$el
      view.$el = $.router.getCurrentPage();
      if (view.render) { //初始化
        view.render();
      }

      if (view.delegateEvents) { //绑定事件
        view.delegateEvents(view.events);
      }
    } else {
      requireView(currentPage);
    }
  }

  var viewRemoved = function(currentPage) { //view remove
    var bindingName = getBindName(currentPage);
    var view = getViewByBindName(bindingName);

    if (view && view.remove) { //页面提移除callback
      view.remove();
    }
  }


  $(document).on("pageAnimationStart", function(e, pageId, $page, a) { //监听页面动画开始
    // debugger
    var prvPage = $.router.getCurrentPage(); // 前一个页面
    viewRemoved(prvPage);

  });
  $(document).on("pageInit", function(e, pageId, $page) { //监听其他页面初始化
    viewInited($page);
  });

  $(document).on("pageReinit", function(e, pageId, $page) { //监听其他页面初始化
    viewInited($page);
  });


  requireView(); //初始化执行一次

});