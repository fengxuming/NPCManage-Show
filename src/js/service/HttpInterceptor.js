/**
 * Created by pro on 2016/11/12.
 */
angular
  .module('inspinia')
  .factory('HttpInterceptor', ['$q', HttpInterceptor]);

function HttpInterceptor($q, $window) {
  return {
    // 请求发出之前，可以用于添加各种身份验证信息
    request: function(config){
      config.headers = config.headers || {};
      if($window.localStorage.token) {
        config.headers['x-access-token'] = $window.localStorage.token;
      }
      return config;
    },
    // 请求发出时出错
    requestError: function(err){
      return $q.reject(err);
    },
    // 成功返回了响应
    response: function(res){
      return res;
    },
    // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
    responseError: function(err){
      if(err.status === 401){
        $window.location.href = 'login.html';
      }
      return $q.reject(err);
    }
  };
}
