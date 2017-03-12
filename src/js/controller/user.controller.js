/**
 * Created by pro on 2016/11/8.
 */
'use strict';

angular.module('inspinia')
  .controller('UserListController', function ($scope, User, $state, TYPES) {
    $scope.types = TYPES;
    $scope.maxSize = 10;
    $scope.currentPage = 1;
    $scope.totalItems = 2000;
    $scope.userType = "all";

    var queryParams = {};
    queryParams.maxSize = $scope.maxSize;
    $scope.keywordSearch = keywordSearch;

    $scope.$watch("currentPage", function (newVal, oldVal) {
      queryParams.offset = ($scope.currentPage - 1) * $scope.maxSize;
      reloadUsers();
    }, true);
    $scope.$watch('userType',function (newVal, oldVal) {
      if(newVal !== undefined && newVal !== oldVal){
        // if(newVal !== 2){
        //   queryParams.status = newVal;
        // }else {
        //   queryParams.status = null;
        // }
        queryParams.userType = newVal;
        $scope.totalItems = 2000;
        $scope.currentPage = 1;
        queryParams.offset = 0;
        reloadUsers();
      }
    });
    function keywordSearch() {
      $scope.totalItems = 2000;
      $scope.currentPage = 1;
      queryParams.offset = 0;
      queryParams.q = $scope.q;
      reloadUsers();
    }
    function reloadUsers(){
      if(queryParams.userType == 'all'){
        delete queryParams.userType;
      }
      User.query(queryParams, {seq: (new Date()).getTime()}, function (data) {
        if (data) {
          $scope.userList = data;
          angular.forEach($scope.userList,function (user)
          {
            if(user.avatar && user.avatar.path){
              user.avatarPath = API_END_POINT + "/" +user.avatar.path.replace('public','');
            }else{
              user.avatarPath = "";
            }
          });
          if(data.length < $scope.maxSize){
            $scope.totalItems = (($scope.currentPage - 1) + data.length/$scope.maxSize)*10;
          }
        }
      });

    }
  })
  .controller('UserDetailController', function ($scope, User,$stateParams,$state, Statuses,uploaderService,GenderOptions) {


    var id = $stateParams.userId;
    if(id){
      var params = {};
      params.id = id;
      User.get(params, function (data){
        $scope.user = data;
        $scope.maleSelected = showGender(data.male);
        if($scope.user.avatar && $scope.user.avatar.path){
          $scope.user.avatarPath = API_END_POINT + "/" +$scope.user.avatar.path.replace('public','');
        }else{
          $scope.user.avatarPath = "";
        }

      })
    }
    $scope.gender_options = GenderOptions;
    $scope.userEdit= userEdit;
    $scope.onSelect = onSelect;
    $scope.saveUser = saveUser;


    function userEdit(Id) {
      $state.go('users.edit',{userId:Id});
    }
    function showGender(gender) {
      var list = GenderOptions;
      for(var i = 0; i <= list.length; i++){
        if(list[i].value == gender){
          return list[i]
        }
      }
    }
    function onSelect(item) {
      $scope.user.male = item.value;
    }
    function saveUser() {
      if($scope.myForm.$valid){
        var userParams = $scope.user;
        if(userParams._id){
          User.update({id:userParams._id},userParams,function (data) {
            if (data){
              $scope.user = data;
              $state.go('users.detail',{userId: data._id})
            }
          })
        }else {
          User.save(userParams,function (data) {
            if (data._id){
              $state.go('users.detail',{userId:data._id});
            }
          })
        }
      }else {
        swal({
          title: "<small>请完善信息再提交！</small>",
          html: true
        })
      }
    }

    //标记删除和停止使用
    $scope.editStatus = function (status) {
      var _user = {};
      _user.status = status;
      if(status == 0){
        var title ='确定停用该用户吗?'
      }else{
        title = '确定删除该用户吗?'
      }
      swal({
        title: "<small>" + title + "</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html:true
      }, function(){
        User.update({id:id},_user, function (data){
          if(data){
            swal({
              title: "修改完毕!",
              text: "状态已经成功修改!",
              type: "success",
              timer: 1000
            });
          }
        })
      });
    };
    //头像上传
    $scope.uploader = uploaderService.buildUploader(function(data){
      $scope.uploader.removeAfterUpload = true;
      var _user = {};
      _user.avatar = data._id;
      $scope.user.avatarPath = API_END_POINT + "/" + data.path.replace('public','');
      $scope.user.avatar =data._id;
      User.update({id:id},_user, function (data){
      })
    });
  });
