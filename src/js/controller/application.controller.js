/**
 * Created by wangruixia on 16/11/16.
 */
'use strict';

angular.module('inspinia')
  .controller('applicationAddController', function ($scope,$state,User,Application,GenderOptions,Exhibition,Part,uploaderService,UserInfo) {

    $scope.genderOptions = GenderOptions;
    $scope.NPC = {};
    $scope.maleSelected ={};
    $scope.skills=[];

    $scope.$watch('exhibition',function () {
      var exhibitionParams = {};
      exhibitionParams.id = $scope.exhibition;
      Exhibition.get(exhibitionParams,function (data) {
        $scope.parts = data.parts;
      });
    });

    var exhibitionParams ={};
    exhibitionParams.user = UserInfo._id;
    Exhibition.query(exhibitionParams,function (data) {
      $scope.exhibitions = data;
    });

    $scope.addSkill = addSkill;
    $scope.saveUserAndApplication = saveUserAndApplication;

    $scope.onSelect = onSelect;

    function saveUserAndApplication() {
      if($scope.exhibition)
      {
        var userParams = $scope.NPC;
        User.save(userParams,function (data) {
          if(data)
          {

            var hopeParts = [];
            angular.forEach($scope.parts,function (part) {
              if(part.selected)
              {
                hopeParts.push(part._id);
              }
            });

            $scope.application.parts = hopeParts;
            $scope.application.skills = $scope.skills;
            var applicationParams = $scope.application;
            applicationParams.applicant = data._id;
            applicationParams.exhibition = $scope.exhibition;
            Application.save(applicationParams,function (data) {
              if(data)
              {
                $state.go('audits.detail',{applicationId:data._id});
              }
            });
          }
        });
      }
      else
      {
        swal({
          title: "<small>请选择展子</small>",
          type: "warning",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "好的",
          closeOnConfirm: true,
          html:true
        });

      }


    }

    function addSkill(skill) {
      $scope.skills.push(skill);
    }

    function onSelect(item) {
      $scope.NPC.male = item.value;
    }

    $scope.uploader = uploaderService.buildUploader(function(data){
      $scope.uploader.removeAfterUpload = true;
      $scope.NPC.avatarPath = API_END_POINT + "/" + data.path.replace('public','');
      $scope.NPC.avatar =data._id;

    });
  });


