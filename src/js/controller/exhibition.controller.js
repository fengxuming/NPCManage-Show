/**
 * Created by wangruixia on 16/11/16.
 */
'use strict';

angular.module('inspinia')
  .controller('ExhibitionListController', function ($scope,$state, Exhibition,UserInfo) {
    var queryParams = {};
    queryParams.organizer = UserInfo._id;
    reloadExhibitions();
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

  .controller('ExhibitionFormController', function ($scope, $state,Exhibition,Discuss,Note, $stateParams, uploaderService,toaster) {
    var id = $stateParams.exhibitionId;
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


    $scope.uploader = uploaderService.buildUploader(function(data){
      $scope.uploader.removeAfterUpload = true;
      $scope.Exhibition.cover = data._id;
      $scope.Exhibition.coverPath = API_END_POINT + "/" + data.path.replace('public','');
      $scope.Exhibition.coverName = data.name;
    });




    $scope.saveBanner = saveBanner;
    $scope.removeBanner = removeBanner;
    function saveBanner() {
      var bannerParams = $scope.banner;
      if(bannerParams.status){
        bannerParams.status = 1
      }
      if(!$scope.banner.title || !$scope.banner.url || !$scope.banner.cover){
        toaster.pop('error', "请检查所填数据的完整性!");
      }else{
        if(bannerParams._id){
          Banner.update({id:bannerParams._id},bannerParams,function (data) {
            if (data){
              $state.go('banner.lists');
            }
          })
        }else {
          Banner.save(bannerParams,function (data) {
            if (data._id){
              $state.go('banner.lists');
            }
          })
        }
      }
    }
    function removeBanner() {
      swal({
        title: "<small>确定删除该banner吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的,删除!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html:true
      }, function(){
              Banner.delete({id:$scope.banner._id},function (data) {
                if (data){
                  swal({
                    title: "删除完毕!",
                    text: "banner已经成功删除!",
                    type: "success",
                    timer: 1000
                  });
                  $state.go('banner.lists')
                }
              })
      });
      }

  });


