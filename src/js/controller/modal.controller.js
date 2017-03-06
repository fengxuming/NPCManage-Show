/**
 * Created by pro on 2016/11/10.
 */
angular.module('inspinia')
  .controller('ModalController', function ($scope, $uibModal) {
    $scope.openAddModal = openAddModal;
    $scope.openEditModal = openEditModal;
    $scope.openPasswordModal = openPasswordModal;
    $scope.openEditMessageModal = openEditMessageModal;
    $scope.openEditReplyModal = openEditReplyModal;
    $scope.openEditAnswerModal = openEditAnswerModal;

    function openAddModal(users,user) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/modal/modal_edit_user.html',
        controller: 'ModalEditUserController',
        resolve: {
          userInfo: function () {
            return {
              users:users,
              user:user
            }
          }
        }
      })
    }
    function openEditModal(user) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/modal/modal_edit_user.html',
        controller: 'ModalEditUserController',
        resolve: {
          userInfo: function () {
            return {user:user}
          }
        }
      });
      modalInstance.result.finally(function () {
        //需要更新用户列表数据

      });
    }

    function openPasswordModal(id) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/modal/modal_edit_password.html',
        controller: 'ModalPasswordController',
        resolve: {
          userInfo: function () {
            return {
              id:id
            }
          }
        }
      })
    }
    function openEditMessageModal(message) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/modal/modal_edit_message.html',
        controller: 'ModalEditMessageController',
        resolve: {
          message: function () {
            return message
          }
        }
      })
    }
    function openEditReplyModal(reply) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/modal/modal_edit_reply.html',
        controller: 'ModalEditReplyController',
        resolve: {
          reply: function () {
            return reply
          }
        }
      })
    }
    function openEditAnswerModal(answer) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/modal/modal_edit_answer.html',
        controller: 'ModalEditAnswerController',
        resolve: {
          answer: function () {
            return answer
          }
        }
      })
    }
  })

  .controller('ModalEditUserController', function ($scope, User, $uibModalInstance, GenderOptions, UserType,userInfo) {
    $scope.gender = {};
    $scope.userType = {};
    $scope.gender_options = GenderOptions;
    $scope.user_types = UserType;
    // if(userInfo.user){
    //   $scope.user = userInfo.user;
    //   if($scope.user.status === 1){
    //     $scope.user.status = true;
    //   }
    // }else if(userInfo.type){
    //   $scope.user = {};
    //   $scope.user.userType = userInfo.type;
    // }
    if(userInfo.user){
      $scope.user = userInfo.user;
    }else{
      $scope.user = {};
      $scope.user.userType = 'user';
    }
    $scope.users = userInfo.users;
    $scope.popup = {
      opened: false
    };
    $scope.open = function() {
      $scope.popup.opened = true;
    };
    if($scope.user.gender !== undefined) $scope.gender.selected = getDropdown('gender');
    if($scope.user.userType) $scope.userType.selected = getDropdown('userType');
    $scope.onSelect = onSelect;
    $scope.closeModal = closeModal;
    $scope.saveUser = saveUser;

    function getDropdown(type) {
      var list;
      if(type == 'gender'){
        list = GenderOptions;
      }else {
        list = UserType;
      }
      for(var i = 0; i <= list.length; i++){
        if(list[i].value === $scope.user[type]){
          return list[i]
        }
      }
    }
    function onSelect(item,type) {
      $scope.user[type] = item.value;
    }
    function saveUser() {
      var userParams = $scope.user;
      userParams.secret = $scope.user.password;
      if(userParams._id)
      {
        User.update({id:userParams._id},userParams,function (data) {
          if(data)
          {
            closeModal();
          }
        });
      }
      else
      {
        User.query({username:userParams.username},function (data2) {
          if(data2.length>0)
          {
            swal({
              title: "<small>账号已存在！</small>",
              html: true
            })
          }
          else {
            userParams.status = 1;
            if($scope.myForm.$valid){
              if(userParams._id){
                User.update({id:userParams._id},userParams,function (data) {
                  if (data){
                    closeModal();
                  }
                })
              }else {
                User.save(userParams,function (data) {
                  if (data._id){
                    closeModal();
                    $scope.users.push(data);
                  }
                })
              }
            }else{
              swal({
                title: "<small>请完善信息再提交！</small>",
                html: true
              })
            }
          }
        });
      }




    }
    function closeModal() {
      $uibModalInstance.close();
    }
  })

  .controller('ModalPasswordController', function ($scope, User, $uibModalInstance,userInfo,toaster) {
    $scope.editPassword = editPassword;
    $scope.closeModal = closeModal;
    var id =  userInfo.id;
    var _user = {};
    function editPassword() {
      _user.secret = $scope.password;
      if($scope.password == $scope.confirmPassword){
        User.update({id: id},_user,function (data) {
          if(data){
            closeModal();
          }
        })
      }else{
          toaster.pop('error', "两次密码不一致,请重新输入!");
      }
    }
    function closeModal() {
      $uibModalInstance.close();
    }
  })

  .controller('ModalEditMessageController', function ($scope, Message, $uibModalInstance,message) {
    if(message.status === 1){
      message.status = true;
    }
    $scope.message = message;
    $scope.closeModal = closeModal;
    $scope.saveMessage = saveMessage;

    function closeModal() {
      $uibModalInstance.close();
    }

    function saveMessage() {
      var messageParams = $scope.message;
      if(messageParams.content){
        if(messageParams.status){
          messageParams.status = 1;
        }else {
          messageParams.status = 0;
        }
        Message.update({id: messageParams._id},messageParams,function (data) {
          if(data){
            $scope.message = data;
            closeModal();
          }
        })
      }else {
        swal({
          title: "<small>请完善信息再提交！</small>",
          html: true
        })
      }
    }
  })
  .controller('ModalEditReplyController', function ($scope, Reply, $uibModalInstance,reply) {
    if(reply.status === 1){
      reply.status = true;
    }
    $scope.reply = reply;
    $scope.closeModal = closeModal;
    $scope.saveReply = saveReply;

    function closeModal() {
      $uibModalInstance.close();
    }

    function saveReply() {
      var replyParams = $scope.reply;
      if(replyParams.content){
        if(replyParams.status){
          replyParams.status = 1;
        }else {
          replyParams.status = 0;
        }
        Reply.update({id: replyParams._id},replyParams,function (data) {
          if(data){
            $scope.reply = data;
            closeModal();
          }
        })
      }else {
        swal({
          title: "<small>请完善信息再提交！</small>",
          html: true
        })
      }
    }
  })
  .controller('ModalEditAnswerController', function ($scope, Answer, $uibModalInstance,answer) {
    $scope.answer = answer;
    $scope.closeModal = closeModal;
    $scope.saveAnswer = saveAnswer;

    function closeModal() {
      $uibModalInstance.close();
    }

    function saveAnswer() {
      var answerParams = $scope.answer;
      if(answerParams.content){
        Answer.update({id: answerParams._id},answerParams,function (data) {
          if(data){
            $scope.answer = data;
            closeModal();
          }
        })
      }else {
        swal({
          title: "<small>请完善信息再提交！</small>",
          html: true
        })
      }
    }
  });
