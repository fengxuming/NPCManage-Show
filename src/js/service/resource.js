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
var API_END_POINT = 'http://localhost:3000';


;(function () {
  angular
    .module('inspinia')
    .factory('User', function ($resource) {
      return $resource(API_END_POINT + "/users/:id", null, action);
    })
    .factory('Application', function ($resource) {
      return $resource(API_END_POINT + "/applications/:id", null, action);
    })
    .factory('Exhibition', function ($resource) {
      return $resource(API_END_POINT + "/exhibitions/:id", null, action);
    })
    .factory('Message', function ($resource) {
      return $resource(API_END_POINT + "/messages/:id", null, action);
    })
    .factory('Part', function ($resource) {
      return $resource(API_END_POINT + "/parts/:id", null, action);
    })
    .factory('Discuss', function ($resource) {
      return $resource(API_END_POINT + "/discusses/:id", null, action);
    })
    .factory('Note', function ($resource) {
      return $resource(API_END_POINT + "/notes/:id", null, action);
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
