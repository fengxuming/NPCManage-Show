(function() {
  'use strict';

  angular
    .module('inspinia')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/components/common/content.html"
      })
      .state('index.main', {
        url: "/main",
        templateUrl: "app/main/main.html"
      })
      .state('index.banner', {
        url: "/banner",
        templateUrl: "app/banner/banner_list.html"
      })

      //用户
      .state('users', {
        abstract: true,
        url: "/users",
        templateUrl: "app/components/common/content.html"
      })

      .state('users.lists', {
        url: "/lists",
        templateUrl: "app/users/user_list.html",
        controller: 'UserListController'
      })
      // .state('users.doctor', {
      //   url: "/doctor",
      //   templateUrl: "app/users/doctor_list.html",
      //   data: {userType: 'doctor'},
      //   controller: 'UserListController'
      // })
      // .state('users.customer', {
      //   url: "/customer",
      //   templateUrl: "app/users/user_list.html",
      //   data: {userType: 'user'},
      //   controller: 'UserListController'
      // })
      .state('users.detail', {
        url: "/detail/:userId",
        views:{
          '@users':{
            templateUrl: "app/users/user_profile.html",
            controller: 'UserDetailController'
          }
        }
      })
      .state('users.add', {
        url: "/add",
        views:{
          '@users':{
            templateUrl: "app/users/user_form.html",
            controller: 'UserDetailController'
          }
        }
      })
      .state('users.edit', {
        url: "/edit/:userId",
        views:{
          '@users':{
            templateUrl: "app/users/user_form.html",
            controller: 'UserDetailController'
          }
        }
      })
      .state('exhibitions', {
        abstract: true,
        url: "/exhibitions",
        templateUrl: "app/components/common/content.html"
      })
      .state('exhibitions.lists', {
        url: "/lists",
        templateUrl: "app/exhibition/exhibition_list.html",
        controller: 'ExhibitionListController'
      })
      .state('exhibitions.detail', {
        url: "/detail/:exhibitionId",
        templateUrl: "app/exhibition/exhibition_detail.html",
        controller: 'ExhibitionFormController'
      })
      .state('exhibitions.add', {
        url: "/add",
        templateUrl: "app/exhibition/exhibition_form.html",
        controller: 'ExhibitionFormController'
      })
      .state('exhibitions.edit', {
        url: "/edit/:exhibitionId",
        templateUrl: "app/exhibition/exhibition_form.html",
        controller: 'ExhibitionFormController'
      })

      .state('audits', {
        abstract: true,
        url: "/audits",
        templateUrl: "app/components/common/content.html"
      })
      .state('audits.lists', {
        url: "/lists",
        templateUrl: "app/audit/audit_list.html",
        controller: 'AuditListController'
      })
      .state('audits.detail', {
        url: "/detail/:applicationId",
        templateUrl: "app/audit/audit_detail.html",
        controller: 'AuditDetailController'
      })
      .state('applications', {
        abstract: true,
        url: "/applications",
        templateUrl: "app/components/common/content.html"
      })
      .state('applications.add', {
        url: "/add",
        templateUrl: "app/application/application_form.html",
        controller: 'applicationAddController'
      })
      .state('applications.edit', {
        url: "/edit/:applicationId",
        templateUrl: "app/application/application_form.html",
        controller: 'applicationAddController'
      })


      .state('show', {
        abstract: true,
        url: "/show",
        templateUrl: "app/components/common/content.html"
      })
      .state('show.main', {
        url: "/main",
        templateUrl: "app/show/show_list.html",
        controller: 'ShowListController'
      })

      .state('parts', {
        abstract: true,
        url: "/parts",
        templateUrl: "app/components/common/content.html"
      })
      .state('parts.lists', {
        url: "/lists",
        templateUrl: "app/part/part_list.html",
        controller: 'PartListController'
      })

    $urlRouterProvider.otherwise('/index/main');
  }

})();
