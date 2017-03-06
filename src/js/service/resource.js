/**
 * Created by pro on 2016/11/7.
 */
var interceptor = {
  response: function(response) {
    var result = response.resource;
    result.$status = response.status;
    return result;
  }
};

var action = {
  get: {
    method: 'GET',
    interceptor: interceptor,
    withCredentials: true
  },
  query: {
    method: 'GET',
    isArray: true,
    interceptor: interceptor,
    withCredentials: true
  },
  update: {
    method: 'PUT',
    interceptor: interceptor,
    withCredentials: true
  },
  save: {
    method: 'POST',
    interceptor: interceptor,
    withCredentials: true
  },
  delete: {
    method: 'DELETE',
    interceptor: interceptor,
    withCredentials: true
  }
};
// var API_END_POINT = 'http://localhost:3000';
// var API_END_POINT = 'http://www.wolaianpai.com:3000';
var API_END_POINT ="";

;(function () {
  angular
    .module('inspinia')
    .factory('User', function ($resource) {
      return $resource(API_END_POINT + "/users/:id", null, action);
    })
    .factory('Question', function ($resource) {
      return $resource(API_END_POINT + "/questions/:id", null, action);
    })
    .factory('Answer', function ($resource) {
      return $resource(API_END_POINT + "/answers/:id", null, action);
    })
    .factory('Message', function ($resource) {
      return $resource(API_END_POINT + "/messages/:id", null, action);
    })
    .factory('Channel', function ($resource) {
      return $resource(API_END_POINT + "/channels/:id", null, action);
    })
    .factory('Reply', function ($resource) {
      return $resource(API_END_POINT + "/replies/:id", null, action);
    })
    .factory('Banner', function ($resource) {
      return $resource(API_END_POINT + "/banners/:id", null, action);
    })
    .factory('HotWord', function ($resource) {
      return $resource(API_END_POINT + "/hotWords/:id", null, action);
    })
  .factory('uploaderService', function(FileUploader,$window){
    return {
      buildUploader:buildUploader
    };
    function buildUploader(onSuccess){
      var uploader = new FileUploader({
        autoUpload:true,
        headers : {
          'x-access-token': $window.localStorage.token
        },
        url: API_END_POINT + '/uploads'
      });
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        if(response._id){
          onSuccess(response);
        }else{
          alert("上传失败！")
        }
      };
      return uploader;
    }
  })
})();
