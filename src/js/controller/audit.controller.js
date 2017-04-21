/**
 * Created by fengxuming on 2017/3/12.
 */
angular.module('inspinia')
    .controller('AuditListController', function ($scope, User, $state, Exhibition,UserInfo,Application) {
        $scope.exhibition = {};
        $scope.maxSize = 10;
        $scope.currentPage = 1;
        $scope.totalItems = 2000;


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

        queryParams.maxSize = $scope.maxSize;

        $scope.$watch('exhibition',function (newVal, oldVal) {
            if(newVal !== undefined && newVal !== oldVal){
                queryParams.exhibition = newVal;
                reloadUsers();
            }

        });
        $scope.$watch("currentPage", function (newVal, oldVal) {
            queryParams.offset = ($scope.currentPage - 1) * $scope.maxSize;
            queryParams.exhibition=$scope.exhibition;
            reloadUsers();
        }, true);



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
        var flag = "fengxuming";
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
                var exhibitionId = $scope.application.exhibition._id;
                var exhibitionParams = {};
                exhibitionParams.id = exhibitionId;
                Exhibition.get(exhibitionParams,function (data) {
                    $scope.parts = data.parts;
                });
                if(data.isPass==1)
                {
                    $scope.isPass = true;
                }
                else
                {
                    $scope.isPass = false;
                }

            })
        }
        $scope.audit = audit;
        function audit() {
            var applicationParams = $scope.application;
            if($scope.isPass)
            {
                applicationParams.isPass = 1;
            }
            else
            {
                applicationParams.isPass = -1;
            }
            Application.update({id:applicationParams._id},applicationParams,function (data) {
                if(data)
                {
                    $state.go("audits.lists");
                    // $state.go('audits.detail',{applicationId:data._id});
                }
            });

        }


    });
