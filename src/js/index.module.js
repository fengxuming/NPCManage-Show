(function() {
  'use strict';

  angular
    .module('inspinia', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap','ui.select','mgcrea.ngStrap','angularFileUpload','ui.bootstrap','toaster', 'ngAnimate'])
    .config(['$httpProvider', function($httpProvider){
      $httpProvider.interceptors.push(HttpInterceptor);
    }])

})();
