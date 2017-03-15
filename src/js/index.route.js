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



      //问医
      .state('asking', {
        abstract: true,
        url: "/asking",
        templateUrl: "app/components/common/content.html"
      })
      .state('asking.question', {
        url: "/question",
        templateUrl: "app/asking/question_list.html",
        controller: 'QuestionListController'
      })
      .state('asking.question.add', {
        url: "/add",
        views:{
          '@asking':{
            templateUrl: "app/asking/question_form.html",
            controller: 'QuestionDetailController'
          }
        }
      })
      .state('asking.question.detail', {
        url: "/detail/:questionId",
        views:{
          '@asking':{
            templateUrl: "app/asking/question_detail.html",
            controller: 'QuestionDetailController'
          }
        }
      })
      .state('asking.question.detail.edit', {
        url: "/detail/:questionId/edit",
        views:{
          '@asking':{
            templateUrl: "app/asking/question_form.html",
            controller: 'QuestionDetailController'
          }
        }
      })
      //热词
      .state('hotWord', {
        abstract: true,
        url: "/hotWord",
        templateUrl: "app/components/common/content.html"
      })
      .state('hotWord.lists', {
        url: "/Lists",
        templateUrl: "app/hotWord/hotWord_list.html",
        controller: 'HotWordListController'
      })

      .state('hotWord.add', {
        url: "/add",
        templateUrl: "app/hotWord/hotWord_form.html",
        controller: 'HotWordFormController'
      })
      .state('hotWord.edit', {
        url: "/:hotWordId/edit",
        templateUrl: "app/hotWord/hotWord_form.html",
        controller: 'HotWordFormController'
      })


      //V诊室
      .state('channel', {
        abstract: true,
        url: "/channel",
        templateUrl: "app/components/common/content.html"
      })
      .state('channel.question', {
        url: "/question",
        templateUrl: "app/channel/channel_list.html",
        controller: 'ChannelListController'
      })
      .state('channel.question.add', {
        url: "/add",
        views:{
          '@channel':{
            templateUrl: "app/channel/channel_form.html",
            controller: 'ChannelDetailController'
          }
        }
      })
      .state('channel.question.detail', {
        url: "/detail/:channelId",
        views:{
          '@channel':{
            templateUrl: "app/channel/channel_detail.html",
            controller: 'ChannelDetailController'
          }
        }
      })
      .state('channel.question.detail.edit', {
        url: "/detail/:channelId/edit",
        views:{
          '@channel':{
            templateUrl: "app/channel/channel_form.html",
            controller: 'ChannelDetailController'
          }
        }
      })

  .state('banner', {
      abstract: true,
      url: "/banner",
      templateUrl: "app/components/common/content.html"
    })
  .state('banner.lists', {
      url: "/lists",
      templateUrl: "app/banner/banner_list.html",
      controller: 'BannerListController'
    })
  .state('banner.add', {
      url: "/add",
      templateUrl: "app/banner/banner_form.html",
      controller: 'BannerFormController'
    })
  .state('banner.edit', {
      url: "/:bannerId/edit",
      templateUrl: "app/banner/banner_form.html",
      controller: 'BannerFormController'
    });
    $urlRouterProvider.otherwise('/index/main');
  }

})();
