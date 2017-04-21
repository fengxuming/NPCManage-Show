/**
 * Created by fengxuming on 2017/3/12.
 */
angular.module('inspinia')
    .controller('ShowListController', function ($scope,Exhibition,Application,DTOptionsBuilder) {
        var partParams = {};
        $scope.$watch('exhibition',function (newVal, oldVal) {
            if(newVal !== undefined && newVal !== oldVal){
                partParams.id = newVal;
                queryParams.exhibition = newVal;
                queryParams.isPass = 1;
                reloadUsers();
                reloadData();
            }
        });

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('<"html5buttons"B>lTfgitp')
            .withButtons([
                {extend: 'copy'},
                {extend: 'csv'},
                {extend: 'excel', title: 'NPC汇总表'},

                {extend: 'print',
                    customize: function (win){
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');

                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                    }
                }
            ]);

        var exhibitionParams ={};
        exhibitionParams.user = UserInfo._id;
        Exhibition.query(exhibitionParams,function (data) {
            $scope.exhibitions = data;
        });
        $scope.applicationList=[];
        var queryParams = {};
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

        function reloadData() {
            Exhibition.get(partParams, function (data) {
                if (data) {
                    $scope.parts = data.parts;
                    for(var i=0;i<$scope.parts.length;i++)
                    {
                        $scope.parts[i].list = [];
                    }

                }
            });

            Application.query(queryParams, function (data) {
                if (data) {
                    for(var a=0;a<data.length;a++) {
                        if (data[a].decidePart) {
                            for (var index = 0; index < $scope.parts.length; index++) {
                                if ($scope.parts[index].name == data[a].decidePart.name) {
                                    $scope.parts[index].list.push(data[a]);
                                }
                            }

                        }
                    }

                }
            });

        }

    });
