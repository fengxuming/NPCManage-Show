
function login() {
  var loginData = {};
  loginData.username = document.getElementById('username').value;
  loginData.password = document.getElementById('password').value;
  ajax({
    url: "http://localhost:3000/api/login",              //请求地址
    type: "POST",                       //请求方式
    data: loginData,
    dataType: "json",
    success: function (response, xml) {
      try {
        if (response) {
          if (window.localStorage) {
            response = JSON.parse(response);
            localStorage.setItem('token', response.access_token);
            var userInfo = JSON.stringify(response.user);
            localStorage.setItem('userInfo', userInfo);
          }
          window.location.href = "index.html";
        } else {
          window.location.href = 'login.html';
        }
      } catch (e) {
        window.location.href = "login.html";
      }
    },
    fail: function () {
      window.location.href = "login.html";
    }
  });
}
function ajax(options) {
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  var params = '';
  if (options.data)params = formatParams(options.data);
  //创建 - 非IE6 - 第一步
  var xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else { //IE6及其以下版本浏览器
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  //接收 - 第三步
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText, xhr.responseXML);
      } else {
        options.fail && options.fail(status);
      }
    }
  }
  //连接 和 发送 - 第二步
  if (options.type == "GET") {
    if (params) {
      xhr.open("GET", options.url + "?" + params, true);
    } else {
      xhr.open("GET", options.url, true);
    }
    xhr.withCredentials = true;
    xhr.send();
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, true);
    //设置表单提交时的内容类型
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }
}
//格式化参数
function formatParams(data) {
  var arr = [];
  for (var name in data) {
    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
  }
  arr.push(("v=" + Math.random()).replace(".", ""));
  return arr.join("&");
}
