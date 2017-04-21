/**
 * Created by wangruixia on 16/11/16.
 */
'use strict';

angular.module('inspinia')
  .controller('ExhibitionListController', function ($scope,$state, Exhibition,UserInfo) {
    var queryParams = {};
    queryParams.organizer = UserInfo._id;
    $scope.keywordSearch = keywordSearch;
    reloadExhibitions();
    function keywordSearch() {
      queryParams.title = $scope.q;
      reloadExhibitions();
    }
    function reloadExhibitions() {
      Exhibition.query(queryParams,function (data) {
        if (data) {
          $scope.exhibitions = data;
          angular.forEach($scope.exhibitions,function (exhibition)
          {
            if(exhibition.cover && exhibition.cover.path){
              exhibition.coverPath = API_END_POINT + "/" +exhibition.cover.path.replace('public','');
            }else{
              exhibition.coverPath = "";
            }
          });
        }
      });
    }
  })

  .controller('ExhibitionFormController', function ($scope, $state,Exhibition,Discuss,Note, $stateParams, uploaderService,UserInfo,Part) {

    var id = $stateParams.exhibitionId;
    $scope.exhibition = {};
    if(id){
      var params = {};
      params.id = id;
      Exhibition.get(params, function (data){
        if(data){
          $scope.exhibition = data;
          if($scope.exhibition.cover && $scope.exhibition.cover.path){
            $scope.exhibition.coverPath = API_END_POINT + "/" +$scope.exhibition.cover.path.replace('public','');
          }else{
            $scope.exhibition.coverPath = "";
          }
          $scope.exhibition.coverName = data.name;


          Part.query(function (data) {
            if(data)
            {
              $scope.parts = data;
              angular.forEach($scope.parts,function (part) {
                angular.forEach($scope.exhibition.parts,function (exhibitionPart) {
                  if(part._id == exhibitionPart._id)
                  {
                    part.selected = true;
                  }
                });
              });
            }
          });

        }
      });

      var noteParams = {};
      noteParams.exhibition = id;
      Note.query(noteParams,function (data) {
        if(data)
        {
          $scope.notes = data;
        }
      });
      var discussParams = {};
      discussParams.exhibition = id;
      Discuss.query(discussParams,function (data) {
        if(data)
        {
          $scope.discusses = data;
        }
      });
    }
    else {
      Part.query(function (data) {
        if(data)
        {
          $scope.parts = data;
        }
      });
    }





    $scope.uploader = uploaderService.buildUploader(function(data){
      $scope.uploader.removeAfterUpload = true;
      $scope.exhibition.cover = data._id;
      $scope.exhibition.coverPath = API_END_POINT + "/" + data.path.replace('public','');
      $scope.exhibition.coverName = data.name;
    });




    $scope.saveExhibition = saveExhibition;
    $scope.removeExhibition = removeExhibition;
    $scope.addPart = addPart;
    function saveExhibition() {

      var exhibitionParts = [];
      angular.forEach($scope.parts,function (part) {
        if(part.selected)
        {
          exhibitionParts.push(part._id);
        }
      });
      $scope.exhibition.parts = exhibitionParts;
      var exhibitionParams = $scope.exhibition;
      if(exhibitionParams._id){
        Exhibition.update({id:exhibitionParams._id},exhibitionParams,function (data) {
          if (data){
            $state.go('exhibitions.detail',{exhibitionId:exhibitionParams._id});
          }
        })
      }else {
        exhibitionParams.organizer = UserInfo._id;
        Exhibition.save(exhibitionParams,function (data) {
          if (data._id){
            $state.go('exhibitions.detail',{exhibitionId:data._id});
          }
        })
      }
    }

    function addPart() {

      var partParams ={};
      partParams.name = $scope.partOfAdd;
      Part.save(partParams,function (data) {
          if(data)
          {
            $scope.parts.push(data);
          }
      });
    }


    function removeExhibition() {
      swal({
        title: "<small>确定删除该展子吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的,删除!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html:true
      }, function(){
              Exhibition.delete({id:$scope.exhibition._id},function (data) {
                if (data){
                  swal({
                    title: "删除完毕!",
                    text: "banner已经成功删除!",
                    type: "success",
                    timer: 1000
                  });
                  $state.go('exhibition.lists')
                }
              })
      });
      }



  });


