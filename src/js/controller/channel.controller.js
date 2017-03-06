/**
 * Created by pro on 2016/11/13.
 */
'use strict';

angular.module('inspinia')
  .controller('ChannelListController', function ($scope, Channel, $state, Statuses) {
    $scope.statuses = Statuses;
    $scope.channelStatus = 1;
    $scope.maxSize = 10;
    $scope.currentPage = 1;
    $scope.totalItems = 2000;
    var queryParams = {};
    queryParams.maxSize = $scope.maxSize;
    queryParams.status = 1;
    $scope.keywordSearch = keywordSearch;
    $scope.$watch("currentPage", function (newVal, oldVal) {
      queryParams.offset = ($scope.currentPage - 1) * $scope.maxSize;
      reloadChannels();
    }, true);
    $scope.$watch('channelStatus',function (newVal, oldVal) {
      if(newVal !== undefined && newVal!== oldVal) {
        if(newVal !== 2){
          queryParams.status = newVal;
        }else {
          queryParams.status = null;
        }
        $scope.totalItems = 2000;
        $scope.currentPage = 1;
        queryParams.offset = 0;
        reloadChannels();
      }
    });

    function keywordSearch() {
      $scope.totalItems = 2000;
      $scope.currentPage = 1;
      queryParams.offset = 0;
      queryParams.q = $scope.q;
      reloadChannels();
    }
    function reloadChannels(){
      Channel.query(queryParams, {seq: (new Date()).getTime()}, function (data) {
        if (data) {
          $scope.channelsList = data;
          if(data.length < $scope.maxSize){
            $scope.totalItems = (($scope.currentPage - 1) + data.length/$scope.maxSize)*10;
          }
        }
      });
    };
  })
  .controller('ChannelDetailController', function ($scope, Channel, $stateParams, Message, $state, User, Reply, Statuses,uploaderService) {
    var id = $stateParams.channelId;
    $scope.channel = {};
    $scope.message = {};
    $scope.reply = {};
    $scope.sender = {};//message新增编辑选择专家对象
    $scope.replyUser = {};//reply新增编辑选择专家对象
    $scope.editor = {};//channel新增编辑选择主持人对象
    $scope.compere = {};//channel新增编辑选择专家对象
    $scope.statuses = Statuses;
    $scope.messageStatus = 1;//message列表显示的初始状态
    $scope.maxSize = 10;
    $scope.currentPage = 1;
    $scope.totalItems = 2000;
    loadRobotUsers();
    var queryParams = {};
    queryParams.maxSize = $scope.maxSize;
    queryParams.status = 1;
    if(id){
      var channelParams = {};
      channelParams.id = id;
      Channel.get(channelParams, function (data){
        if(data){
          if(data.status === 1){
            data.status = true;
          }else {
            data.status = false;
          }
          $scope.editor.selected = data.user;
          $scope.compere.selected = data.compere;
          $scope.channel = data;
          $scope.usersList = new Array();
          $scope.usersList.push(data.user);
          $scope.usersList.push(data.compere);
          if($scope.channel.cover && $scope.channel.cover.path){
            $scope.channel.coverPath = API_END_POINT_temp + "/" +$scope.channel.cover.path.replace('public','');
          }else{
            $scope.channel.coverPath = "";
          }
          $scope.channel.coverName = data.name;

        }
      });
      queryParams.channel = id;
      queryParams.status = 1;
    }
    $scope.selectUser = selectUser;
    $scope.refreshUsers = refreshUsers;
    $scope.keywordSearch = keywordSearch;
    $scope.refreshMesList = refreshMesList;
    $scope.saveChannel = saveChannel;
    $scope.deleteChannel = deleteChannel;
    $scope.saveMessage = saveMessage;
    $scope.deleteMessage = deleteMessage;
    $scope.saveReply = saveReply;
    $scope.deleteReply = deleteReply;

    $scope.$watch("currentPage", function (newVal, oldVal) {
      queryParams.offset = ($scope.currentPage - 1) * $scope.maxSize;
      reloadMessages();
    }, true);
    $scope.$watch('messageStatus',function (newVal, oldVal) {
      if(newVal !== undefined && newVal!== oldVal) {
        if(newVal !== 2){
          queryParams.status = newVal;
        }else {
          queryParams.status = null;
        }
        queryParams.channel = id;
        $scope.totalItems = 2000;
        $scope.currentPage = 1;
        queryParams.offset = 0;
        reloadMessages();
      }
    });


    $scope.uploader = uploaderService.buildUploader(function(data){
      $scope.uploader.removeAfterUpload = true;
      $scope.channel.cover = data._id;
      $scope.channel.coverPath = API_END_POINT_temp + "/" + data.path.replace('public','');
      $scope.channel.coverName = data.name;
    });
    function reloadMessages(){
      Message.query(queryParams, {seq: (new Date()).getTime()}, function (data) {
        if (data) {
          $scope.messagesList = data;
          if(data.length < $scope.maxSize){
            $scope.totalItems = (($scope.currentPage - 1) + data.length/$scope.maxSize)*10;
          }
        }
      })
    }
    function refreshUsers(select, userType, from) {
        if(userType){
          User.query({q: select,userType: userType},function (data) {
            if(data){
              if(from === 'form'){
                if(userType === 'editor'){
                  $scope.editorsList = data;
                }else {
                  $scope.comperesList = data;
                }
              }else{
                $scope.usersList = data;
              }
            }
          })
        }else {
          $scope.usersList = [];
        }
    }
    function selectUser(item, type, from) {
      $scope[from][type] = item._id;
    }
    function saveChannel() {
      var channelParams = $scope.channel;
      if($scope.myForm.$valid && channelParams.compere){
        if(channelParams._id){
          if(channelParams.status){
            channelParams.status = 1;
          }else {
            channelParams.status = 0;
          }
          Channel.update({id:channelParams._id},channelParams,function (data) {
            if (data){
              $scope.channel = data;
              $state.go('channel.question.detail',{channelId: data._id})
            }
          })
        }else {
          channelParams.status = 1;
          Channel.save(channelParams,function (data) {
            if (data._id){
              $state.go('channel.question');
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
    function deleteChannel() {
      swal({
        title: "<small>确定删除该频道吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，删除!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html:true
      }, function(){
        Channel.delete({id: $scope.channel._id},function (data) {
          if(data){
            swal({
              title: "删除完毕!",
              text: "频道已经成功删除!",
              type: "success",
              timer: 1000
            });
            $state.go('channel.question');
          }
        })
      });
    }
    function saveMessage() {
      var messageParams = $scope.message;
      if($scope.message.user=="user")
      {
        messageParams.user = $scope.channel.user;
      }
      if($scope.message.user =="compere")
      {
        messageParams.user = $scope.channel.compere;
      }
      if($scope.message.user =="robot")
      {

        var length = $scope.RobotUsers.length;
        messageParams.user = $scope.RobotUsers[Math.floor(Math.random()*length)];

      }
      if(messageParams.content && messageParams.user){
        messageParams.channel = $scope.channel._id;
        messageParams.status = 1;
        Message.save(messageParams,function (data) {
          if(data){
            $scope.message = {};
            $scope.sender.selected = {};
            $scope.userType = undefined;
            // $scope.messagesList.unshift(data);
            refreshMesList($scope.channel._id);

          }
        })
      }else {
        swal({
          title: "<small>请完善信息再提交！</small>",
          html: true
        })
      }
    }
    function deleteMessage(index) {
      swal({
        title: "<small>确定删除该信息吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，删除!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html:true
      }, function(){
        Message.delete({id: $scope.messagesList[index]._id},function (data) {
          if(data){
            swal({
              title: "删除完毕!",
              text: "信息已经成功删除!",
              type: "success",
              timer: 1000
            });
            $scope.messagesList.splice(index,1);
          }
        })
      });
    }
    function saveReply(index) {
      var replyParams = $scope.reply;
      if(replyParams.user && replyParams.content){
        replyParams.message = $scope.messagesList[index]._id;
        replyParams.status = 1;
        replyParams.release ="true";
        Reply.save(replyParams,function (data) {
          if(data){
            $scope.reply = {};
            $scope.replyUser.selected = {};
            var messageParams = {};
            messageParams.id = $scope.messagesList[index]._id;
            Message.get(messageParams, function (data)
            {
              if (data) {
                // $scope.messagesList[index] = data;
                $scope.messagesList[index].replies =data.replies;
              }
            });


            // $scope.messagesList[index].replies.push(data);
            // refreshMesList($scope.channel._id);

          }
        })
      }else {
        swal({
          title: "<small>请完善信息再提交！</small>",
          html: true
        })
      }
    }
    function deleteReply(outerIndex,index) {
      swal({
        title: "<small>确定删除该回复吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，删除!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html:true
      }, function(){
        Reply.delete({id: $scope.messagesList[outerIndex].replies[index]._id},function (data) {
          if(data){
            swal({
              title: "删除完毕!",
              text: "回复已经成功删除!",
              type: "success",
              timer: 1000
            });
            $scope.messagesList[outerIndex].replies.splice(index,1);
          }
        })
      });
    }
    function keywordSearch() {
      $scope.totalItems = 2000;
      $scope.currentPage = 1;
      queryParams.offset = 0;
      queryParams.q = $scope.search.q;
      reloadMessages();
    }

    function loadRobotUsers() {
      var robotUserType = "robot";
      User.query({userType:robotUserType},function (data) {
        if(data){
         $scope.RobotUsers = data;
        }
      })
    }


    function refreshMesList(id,messageStatus) {
      queryParams.q = '';
      queryParams.channel = id;
      queryParams.status = messageStatus;

      queryParams.offset = 0;
      Message.query(queryParams, {seq: (new Date()).getTime()}, function (data) {
        if (data) {
          $scope.messagesList = data;
        }
      })
    }



  });
