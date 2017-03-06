'use strict';

angular.module('inspinia')
  .controller('MainController', function (UserInfo, $scope, $window) {
    var vm = this;
    vm.userName = UserInfo.realName;
    $scope.logout = logout;

    function logout() {
      swal({
        title: "<small>确定退出登录吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html: true
      }, function(){
        $window.localStorage.clear();
        $window.location.href = 'login.html';
      });
    }
  });
