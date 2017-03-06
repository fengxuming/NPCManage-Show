/**
 * Created by wangruixia on 16/11/16.
 */
'use strict';

angular.module('inspinia')
  .controller('BannerListController', function ($scope,$state, Banner,Statuses) {
    $scope.statuses = Statuses;
    $scope.status = 1;
    var queryParams = {};
    queryParams.status = 1;
    reloadBanners();
    $scope.$watch('status',function (newVal, oldVal) {
      if(newVal !== undefined && newVal!== oldVal) {
        if(newVal !== 2){
          queryParams.status = newVal;
        }else {
          queryParams.status = null;
        }
        reloadBanners();
      }
    });

    function reloadBanners() {
      Banner.query(queryParams,function (data) {
        if (data) {
          $scope.banners = data;
          angular.forEach($scope.banners,function (banner)
          {
            if(banner.cover && banner.cover.path){
              banner.coverPath = API_END_POINT_temp + "/" +banner.cover.path.replace('public','');
            }else{
              banner.coverPath = "";
            }
          });
        }
      });
    }
  })
  .controller('BannerFormController', function ($scope, $state,Banner, $stateParams, uploaderService,toaster) {
    var id = $stateParams.bannerId;
    if(id){
      var params = {};
      params.id = id;
      Banner.get(params, function (data){
        if(data){
          $scope.banner = data;
          if($scope.banner.cover && $scope.banner.cover.path){
            $scope.banner.coverPath = API_END_POINT_temp + "/" +$scope.banner.cover.path.replace('public','');
          }else{
            $scope.banner.coverPath = "";
          }
          $scope.banner.coverName = data.name;
          if($scope.banner.status == 1){
            $scope.banner.status = true;
          }
        }
      })
    }else{
      $scope.banner = {};
      $scope.banner.status = true;
    }

    $scope.uploader = uploaderService.buildUploader(function(data){
      $scope.uploader.removeAfterUpload = true;
      $scope.banner.cover = data._id;
      $scope.banner.coverPath = API_END_POINT_temp + "/" + data.path.replace('public','');
      $scope.banner.coverName = data.name;
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

  })
  .controller('HotWordListController', function ($scope,$state, HotWord) {
    // $scope.statuses = Statuses;


    $scope.maxSize = 40;
    $scope.currentPage = 1;
    $scope.totalItems = 2000;
    var queryParams = {};
    queryParams.maxSize = $scope.maxSize;
    $scope.keywordSearch = keywordSearch;

    reloadHotWord();
    $scope.$watch("currentPage", function () {
      queryParams.offset = ($scope.currentPage - 1) * $scope.maxSize;
      reloadHotWord();
    }, true);

    function keywordSearch() {
      $scope.totalItems = 2000;
      $scope.currentPage = 1;
      queryParams.offset = 0;
      queryParams.q = $scope.q;
      reloadHotWord();
    }

    function reloadHotWord()
    {
      HotWord.query(queryParams,function (data) {
        if (data) {
          $scope.hotWords = data;
          if(data.length < $scope.maxSize){
            $scope.totalItems = (($scope.currentPage - 1) + data.length/$scope.maxSize)*10;
          }
        }
      });
    }


  })

  .controller('HotWordFormController', function ($scope, $state,HotWord, $stateParams, uploaderService) {
    var id = $stateParams.hotWordId;
    if(id){
      var params = {};
      params.id = id;
      HotWord.get(params, function (data){
        if(data){
          $scope.hotWord = data;
        }
      })
    }


    $scope.saveHotWord = saveHotWord;
    $scope.removeHotWord = removeHotWord;
    function saveHotWord() {
      var hotWordParams = $scope.hotWord;
      if(hotWordParams&&hotWordParams.name&&hotWordParams.hot) {
        if (hotWordParams._id) {
          HotWord.update({id: hotWordParams._id}, hotWordParams, function (data) {
            if (data) {
              $state.go('hotWord.lists');
            }
          })
        } else {
          HotWord.query({name: hotWordParams.name}, function (data) {
            if (!data) {
              HotWord.save(hotWordParams, function (data) {
                if (data._id) {
                  $state.go('hotWord.lists');
                }
              })
            }
            else {
              swal({
                title: "<small>热词已添加过！</small>",
                html: true
              })
            }
          });
        }
      }
      else
      {
        swal({
          title: "<small>请完善信息！</small>",
          html: true
        })
      }





    }
    function removeHotWord() {
      swal({
        title: "<small>确定删除该热词吗？</small>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的,删除!",
        cancelButtonText:"取消",
        closeOnConfirm: false,
        html:true
      }, function(){
        HotWord.delete({id:$scope.hotWord._id},function (data) {
          if (data){
            swal({
              title: "删除完毕!",
              text: "热词已经成功删除!",
              type: "success",
              timer: 1000
            });
            $state.go('hotWord.lists')
          }
        })
      });
    }

  });

