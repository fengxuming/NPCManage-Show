/**
 * Created by pro on 2016/11/13.
 */
'use strict';

angular.module('inspinia')
  .controller('QuestionListController', function ($scope, Question, $state, Statuses) {
    $scope.statuses = Statuses;
    $scope.questionStatus = 1;
    $scope.maxSize = 10;
    $scope.currentPage = 1;
    $scope.totalItems = 2000;
    var queryParams = {};
    queryParams.maxSize = $scope.maxSize;
    queryParams.status = 1;
    $scope.keywordSearch = keywordSearch;
    $scope.$watch("currentPage", function (newVal, oldVal) {
      queryParams.offset = ($scope.currentPage - 1) * $scope.maxSize;
      reloadQuestions();
    }, true);
    $scope.$watch('questionStatus',function (newVal, oldVal) {
      if(newVal !== undefined && newVal!== oldVal) {
        if(newVal !== 2){
          queryParams.status = newVal;
        }else {
          queryParams.status = null;
        }
        $scope.totalItems = 2000;
        $scope.currentPage = 1;
        queryParams.offset = 0;
        reloadQuestions();
      }
    });

    function keywordSearch() {
      $scope.totalItems = 2000;
      $scope.currentPage = 1;
      queryParams.offset = 0;
      queryParams.q = $scope.q;
      reloadQuestions();
    }
    function reloadQuestions(){
      Question.query(queryParams, {seq: (new Date()).getTime()}, function (data) {
        if (data) {
          $scope.questionsList = data;
          if(data.length < $scope.maxSize){
            $scope.totalItems = (($scope.currentPage - 1) + data.length/$scope.maxSize)*10;
          }
        }
      });
    };
  })
  .controller('QuestionDetailController', function ($scope, Question, $stateParams, Answer, $state, User, GenderOptions) {
    var id = $stateParams.questionId;
    $scope.question = {};
    $scope.answer = {};
    $scope.quizzer = {};
    $scope.user = {};
    $scope.release=false;
    if(id){
      Question.get({id: id}, function (data){
        if(data){
          if(data.status === 1){
            data.status = true;
          }
          if(!data.meta) data.meta = {};
          if(!$scope.gender) $scope.gender = {};
          if(data.meta.gender || data.meta.gender === 0) $scope.gender.selected = showGender(data.meta.gender);
          $scope.quizzer.selected = data.user;
          $scope.question = data;
        }
      });
    }
    $scope.gender_options = GenderOptions;
    $scope.saveQuestion = saveQuestion;
    $scope.saveAnswer = saveAnswer;
    $scope.refreshQuestion = refreshQuestion;
    $scope.refreshUsers = refreshUsers;
    $scope.selectUser = selectUser;
    $scope.selectSender = selectSender;
    $scope.onSelect = onSelect;
    $scope.deleteQuestion = deleteQuestion;
    $scope.deleteAnswer = deleteAnswer;
    $scope.cancelQuestion = cancelQuestion;
    $scope.confirmQuestion = confirmQuestion;
    loadUsers();
    loadRobotUsers();


    function showGender(gender) {
      var list = GenderOptions;
      for(var i = 0; i <= list.length; i++){
        if(list[i].value === gender){
          return list[i]
        }
      }
    }
    function onSelect(item) {
      $scope.question.meta.gender = item.value;
    }
    function loadUsers() {
      User.query({userType: $scope.userType},function (data) {
        if(data){
          $scope.usersList = data;
        }
      })
    }
    function loadRobotUsers() {
      var robotUserType = "robot";
      User.query({userType:robotUserType},function (data) {
        if(data){
          $scope.robotUsersList = data;
        }
      })
    }
    function refreshQuestion(id)
    {
      if(id){
        Question.get({id: id}, function (data){
          if(data){
            if(data.status === 1){
              data.status = true;
            }
            if(!data.meta) data.meta = {};
            if(!$scope.gender) $scope.gender = {};
            if(data.meta.gender || data.meta.gender === 0) $scope.gender.selected = showGender(data.meta.gender);
            $scope.quizzer.selected = data.user;
            $scope.question = data;
          }
        });
      }
    }
    function refreshUsers(select) {
      User.query({q: select,userType: $scope.userType},function (data) {
        if(data){
          $scope.usersList = data;
        }
      })
    }
    function selectSender(item) {
      $scope.question.user = item._id;
    }
    function selectUser(item) {
      $scope.answer.user = item._id;
    }
    function saveQuestion() {
      if($scope.myForm.$valid && $scope.question.user){
        var questionParams = $scope.question;
        if(questionParams.status){
          questionParams.status = 1;
        }else {
          questionParams.status = 0;
        }
        if(questionParams._id){
          Question.update({id:questionParams._id},questionParams,function (data) {
            if (data){
              $scope.question = data;
              $state.go('asking.question.detail',{questionId: data._id})
            }
          })
        }else {
          Question.save(questionParams,function (data) {
            if (data._id){
              $state.go('asking.question');
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
    function saveAnswer() {
      var answerParams = $scope.answer;
      if(answerParams.user && answerParams.content){
        if(answerParams.user && answerParams.content){
          answerParams.question = $scope.question._id;

        answerParams.release = "false";
        if($scope.release==true)
        {
          answerParams.release ="true";
        }


          Answer.save(answerParams,function (data) {
            if(data){
              $scope.answer = {};
              $scope.user.selected = {};
              if(!$scope.question.answers) $scope.question.answers = [];
              refreshQuestion($scope.question._id);
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
    function cancelQuestion() {

      Question.update({id:$scope.question._id},{status:0},function (data) {
        if(data)
        {
          $scope.question.status = 0;
          swal({
            title: "<small>已取消发布！</small>",
            html: true
          })

        }
      });

    }

    function confirmQuestion() {
      if($scope.question.answers.length>0)
      {
        Question.update({id:$scope.question._id},{status:1},function (data) {
          if(data)
          {
            $scope.question.status = true;
            swal({
              title: "<small>已发布！</small>",
              html: true
            })

          }
        });
      }
      else
      {
        swal({
          title: "<small>请添加回答！</small>",
          html: true
        })
      }



    }


    function deleteQuestion() {
      swal({
        title: "<small>确定删除该问题吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，删除!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html: true
      }, function(){
        Question.delete({id: $scope.question._id},function (data) {
          if(data){
            swal({
              title: "删除完毕!",
              text: "问题已经成功删除!",
              type: "success",
              timer: 1000
            });
            $state.go('asking.question');
          }
        })
      });
    }
    function deleteAnswer(index) {
      swal({
        title: "<small>确定删除该回答吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，删除!",
        cancelButtonText:"取消",
        closeOnConfirm: true,
        html: true
      }, function(){
        Answer.delete({id: $scope.question.answers[index]._id},function (data) {
          if(data){
            swal({
              title: "删除完毕!",
              text: "回答已经成功删除!",
              type: "success",
              timer: 1000
            });
            $scope.question.answers.splice(index,1);
          }
        })
      });
    }
  });
