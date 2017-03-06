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
  .controller('UserDetailController', function ($scope, User,Channel,Answer,Question, $stateParams,$state, Statuses,uploaderService) {
    //返回user信息
    var id = $stateParams.userId;
    if(id){
      var params = {};
      params.id = id;
      User.get(params, function (data){
        if(data){
          if(data.status === 1){
            data.status = true;
          }
          $scope.user = data;
          if($scope.user.userType == 'editor'){
            reloadChannels();
          }else if($scope.user.userType == 'doctor'){
            reloadChannels();
            reloadAnswers();
          }else if($scope.user.userType == 'user'){
            reloadQuestions()
          }
          if($scope.user.birthday){
            $scope.user.birthday = new Date($scope.user.birthday);
          }
          if($scope.user.avatar && $scope.user.avatar.path){
            $scope.user.avatarPath = API_END_POINT_temp + "/" +$scope.user.avatar.path.replace('public','');
          }else{
            $scope.user.avatarPath = "";
          }

        }
      })
    }

    //返回channel信息
    var queryParams = {};
    queryParams.status = 1;
    queryParams.user =$stateParams.userId;
    // function showMore()
    // {
    //   queryParams.maxSize = 5 ;
    //   queryParams.offset = $scope.offset+queryParams.maxSize;
    //   $scope.offset = queryParams.offset;
    //   reloadChannels();
    // }
    function reloadChannels(){
      Channel.query(queryParams, {seq: (new Date()).getTime()}, function (data) {
        if (data) {
          $scope.channelsList = data;
          if(data.length < $scope.maxSize){
            $scope.totalItems = (($scope.currentPage - 1) + data.length/$scope.maxSize)*10;
          }
        }
      });
    }

    //返回answers信息
    var queryParams2 = {};
    queryParams2.user =$stateParams.userId;
    function showMore2()
    {
      queryParams2.maxSize = 5 ;
      queryParams2.offset = $scope.offset2+queryParams2.maxSize;
      $scope.offset2 = queryParams2.offset;
      reloadAnswers();
    }
    function reloadAnswers(){
      Answer.query(queryParams2, {seq: (new Date()).getTime()}, function (data) {
        if (data) {
          $scope.answersList = data;
          if(data.length < $scope.maxSize){
            $scope.totalItems = (($scope.currentPage - 1) + data.length/$scope.maxSize)*10;
          }
        }
      });
    }

    //返回questions信息
    var queryParams3 = {};
    queryParams3.status = 1;
    queryParams3.user =$stateParams.userId;
    // function showMore3()
    // {
    //   queryParams3.maxSize = 5 ;
    //   queryParams3.offset = $scope.offset2+queryParams3.maxSize;
    //   $scope.offset2 = queryParams3.offset;
    //   reloadQuestions();
    // }
    function reloadQuestions(){
      Question.query(queryParams3, {seq: (new Date()).getTime()}, function (data) {
        if (data) {
          $scope.questionList = data;
          if(data.length < $scope.maxSize){
            $scope.totalItems = (($scope.currentPage - 1) + data.length/$scope.maxSize)*10;
          }
        }
      });
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
      $scope.user.avatarPath = API_END_POINT_temp + "/" + data.path.replace('public','');
      User.update({id:id},_user, function (data){
      })
    });
  });
