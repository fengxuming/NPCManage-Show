/**
 * Created by wangruixia on 16/11/16.
 */
'use strict';

angular.module('inspinia')
  .controller('BannerListController1', function ($scope,$state, Banner) {

     Banner.query(function (data) {
        if (data) {
          $scope.banners = data;
          angular.forEach($scope.banners,function (banner)
          {
            if(banner.cover && banner.cover.path){
              banner.coverPath = API_END_POINT + "/" +banner.cover.path.replace('public','');
            }else{
              banner.coverPath = "";
            }
          });
        }
      });
  })
  .controller('BannerFormController', function ($scope, $state,Banner, $stateParams, uploaderService) {
    var id = $stateParams.bannerId;
    if(id){
      var params = {};
      params.id = id;
      Banner.get(params, function (data){
        if(data){
          $scope.banner = data;
          if($scope.banner.cover && $scope.banner.cover.path){
            $scope.banner.coverPath = API_END_POINT + "/" +$scope.banner.cover.path.replace('public','');
          }else{
            $scope.banner.coverPath = "";
          }
          $scope.banner.coverName = data.name;
        }
      })
    }
    $scope.uploader = uploaderService.buildUploader(function(data){
      $scope.uploader.removeAfterUpload = true;
      $scope.banner.cover = data._id;
      $scope.banner.coverPath = API_END_POINT + "/" + data.path.replace('public','');
      $scope.banner.coverName = data.name;
    });
    $scope.saveBanner = saveBanner;
    $scope.removeBanner = removeBanner;
    function saveBanner() {
      var bannerParams = $scope.banner;
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

