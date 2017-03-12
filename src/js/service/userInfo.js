/**
 * Created by pro on 2016/11/15.
 */
angular
  .module('inspinia')
  .factory('UserInfo', UserInfo);

function UserInfo($window) {
  var userInfo = {};
  if($window.localStorage.userInfo){
    userInfo = JSON.parse($window.localStorage.userInfo);
  }
  // else {
  //   $window.location.href = 'login.html';
  // }
  return userInfo
}
