/**
 * Created by fengxuming on 2017/3/12.
 */
angular.module('inspinia')
    .controller('AuditListController', function ($scope, User, $state, Exhibition,UserInfo,Application) {
        // $scope.types = TYPES;
        // $scope.maxSize = 10;
        // $scope.currentPage = 1;
        // $scope.totalItems = 2000;
        // $scope.userType = "all";

        $scope.exhibition = {};

        var userId = UserInfo._id;
        var exhibitionParams = {};
        exhibitionParams.user = userId;
        Exhibition.query(exhibitionParams,function (data) {
            if(data)
            {
                $scope.exhibitions = data;

            }
        });





        var queryParams = {};
        // queryParams.maxSize = $scope.maxSize;
        //
        // $scope.keywordSearch = keywordSearch;
        //
        // $scope.$watch("currentPage", function (newVal, oldVal) {
        //     queryParams.offset = ($scope.currentPage - 1) * $scope.maxSize;
        //     reloadUsers();
        // }, true);
        //
        //
        $scope.$watch('exhibition',function (newVal, oldVal) {
            if(newVal !== undefined && newVal !== oldVal){
                queryParams.exhibition = newVal;
                reloadUsers();
            }
        });
        // function keywordSearch() {
        //     $scope.totalItems = 2000;
        //     $scope.currentPage = 1;
        //     queryParams.offset = 0;
        //     queryParams.q = $scope.q;
        //     reloadUsers();
        // }
        function reloadUsers(){
            Application.query(queryParams, function (data) {
                if (data) {
                    $scope.applicationList = data;
                    angular.forEach($scope.applicationList,function (application)
                    {
                        if(application.applicant.avatar && application.applicant.avatar.path){
                            application.applicant.avatarPath = API_END_POINT + "/" +application.applicant.avatar.path.replace('public','');
                        }else{
                            application.applicant.avatarPath = "";
                        }
                    });

                }
            });

        }
    })
    .controller('AuditDetailController', function ($scope, User,$stateParams, $state, Exhibition,UserInfo,Application) {
        $scope.tags = [{ text: 'Amsterdam' },
            { text: 'Washington' },
            { text: 'Sydney' },
            { text: 'Cairo' },
            { text: 'Beijing' }];
        var id = $stateParams.applicationId;
        if(id){
            var params = {};
            params.id = id;
            Application.get(params, function (data){
                $scope.application = data;
                if($scope.application.applicant.avatar && $scope.application.applicant.avatar.path){
                    $scope.application.applicant.avatarPath = API_END_POINT + "/" +$scope.application.applicant.avatar.path.replace('public','');
                }else{
                    $scope.application.applicant.avatarPath = "";
                }

            })
        }
    });
