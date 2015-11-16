define([], function() {
  return View.extend({
    events: {
      "click #login": "onLogin",
      "click #logout": "onLogout"
    },
    render: function() {
      this.isLogin(); //判断是否登录过
    },
    isLogin: function() { //判断是否登录过
      var currentPage = this.$el;
      var loginId = window.localStorage['loginId'];
      if (loginId && loginId !== "" && loginId !== "undefined") {
        currentPage.find(".logout-form").removeClass("hidden");
        currentPage.find(".login-form").parents(".content-inner").addClass("hidden");
        currentPage.find(".login-username").text(window.localStorage['loginName']);
      } else {
        currentPage.find(".logout-form").addClass("hidden");
        currentPage.find(".login-form").parents(".content-inner").removeClass("hidden");
      }
    },
    onLogin: function() { //登录
      var currentPage = this.$el;
      var loginName = currentPage.find("#username").val();
      var password = currentPage.find("#password").val();
      if (loginName && loginName !== "" && password && password !== "") {
        $.ajax({
          "url": "https://www.apicloud.com/mcm/api/user/login",
          "type": "post",
          "cache": false,
          "dataType": "JSON",
          "headers": {
            "X-APICloud-AppId": "A6991061087532",
            "X-APICloud-AppKey": "your appkey"
          },
          "data": {
            "username": loginName,
            "password": password
          },
          beforeSend: function() {
            $.showPreloader();
          },
          success: function(data, status, header) {
            if (data.error) {
              $.hidePreloader();
              $.alert(data.error.message);
            } else {
              $.hidePreloader();
              $.alert("登录成功");
              window.localStorage['loginId'] = JSON.parse(data).id;
              window.localStorage['loginName'] = loginName;
              currentPage.find(".login-username").text(loginName);
              currentPage.find(".logout-form").removeClass("hidden");
              currentPage.find(".login-form").parents(".content-inner").addClass("hidden");
            }
          },
          error: function(err, data, rsp) {
            $.hidePreloader();
            var response;
            try {
              response = JSON.parse(err.response);
            } catch (e) {
              response = err.response;
            }
            if (response) {
              $.alert(response.error.message);
            }
          },
          complete: function() {

          }
        })
      } else {
        $.alert("请完善页面信息");
      }

    },
    onLogout: function() { //退出
      var currentPage = this.$el;
      $.ajax({
        "url": "https://www.apicloud.com/mcm/api/user/logout",
        "type": "post",
        "cache": false,
        "dataType": "JSON",
        "headers": {
          "X-APICloud-AppId": "A6991061087532",
          "X-APICloud-AppKey": "your appkey",
          "authorization": window.localStorage['loginId']
        },

        beforeSend: function() {
          $.showPreloader();
        },
        success: function(data, status, header) {
          if (data.error) {
            $.hidePreloader();
            $.alert(data.error.message);
          } else {
            $.hidePreloader();
            $.alert("退出成功");
            window.localStorage.removeItem("loginId");
            window.localStorage.removeItem("loginName");
            currentPage.find(".logout-form").addClass("hidden");
            currentPage.find(".login-form").parents(".content-inner").removeClass("hidden");
          }
        },
        error: function(err, data, rsp) {
          $.hidePreloader();

          var response;
          try {
            response = JSON.parse(err.response);
          } catch (e) {
            response = err.response;
          }
          if (response) {
            $.alert(response.error.message);
          }

        },
        complete: function() {

        }
      })
    }

  });
});