define([], function() {
  return View.extend({
    events: {
      "click #registe": "onRegiste",
    },
    onRegiste: function() { //注册
      var currentPage = this.$el;
      var password = currentPage.find("#password").val();
      var repassword = currentPage.find("#re-password").val();
      var username = currentPage.find("#username").val();
      var email = currentPage.find("#email").val();

      if (repassword !== "" && password !== "" && username !== "" && email !== "") {
        var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!emailReg.test(email)) {
          $.alert("邮箱不符合规范");
          return false;
        }
        if (password === repassword) {
          $.ajax({ //registe api
            "url": "https://www.apicloud.com/mcm/api/user",
            "type": "post",
            "cache": false,
            "headers": {
              "X-APICloud-AppId": "A6991061087532",
              "X-APICloud-AppKey": "your appkey"
            },
            "data": {
              "username": currentPage.find("#username").val(),
              "password": currentPage.find("#password").val(),
              "email": currentPage.find("#email").val()
            },
            beforeSend: function() {
              $.showPreloader();
            },
            success: function(data, status, header) {
              if (data.error) {
                $.hidePreloader();
                $.alert(data.error.message);
                // $.alert(data.error.message);
              } else {
                $.hidePreloader();
                $.alert("注册成功，请验证邮箱后登录");
                // $.alert("登录成功")
              }
            },
            error: function(err) {
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
          $.alert("两段密码不一致");
        }
      } else {
        $.alert("请完善页面信息");
      }

    }

  });
});