/**
 * Created by fengxuming on 2017/3/12.
 */
angular.module('inspinia')
    .controller('PartListController', function ($scope, User, $state, Exhibition,UserInfo,Application,$timeout) {
        $scope.flag = "fengxuming";
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
        var queryParams ={};
        var NPCParams = {};
        $scope.$watch('exhibition',function (newVal, oldVal) {
            if(newVal !== undefined && newVal !== oldVal){
                queryParams.id = newVal;
                NPCParams.exhibition = newVal;
                NPCParams.isPass = 1;
                reloadExhibitionAndNPC();

            }
        });
        $scope.saveParts = saveParts;

        function saveParts() {
            angular.forEach($scope.parts,function (part) {
                angular.forEach(part.list,function (application) {
                    var applicationParams = application;
                    applicationParams.decidePart = part._id;
                    Application.update({id:applicationParams._id},applicationParams,function (data) {
                    });
                });
            });
        }



        function reloadExhibitionAndNPC() {
            Exhibition.get(queryParams, function (data) {
                if (data) {
                    $scope.parts = data.parts;
                    for(var i=0;i<$scope.parts.length;i++)
                    {
                        $scope.parts[i].list = [];
                    }

                }
            });

            Application.query(NPCParams, function (data) {
                if (data) {
                    $scope.applicationList = [];
                    for(var a=0;a<data.length;a++) {
                        if (data[a].decidePart) {
                            for (var index = 0; index < $scope.parts.length; index++) {
                                if ($scope.parts[index].name == data[a].decidePart.name) {
                                    $scope.parts[index].list.push(data[a]);
                                }
                            }

                        }
                        else {
                            $scope.applicationList.push(data[a]);
                        }
                    }

                }
            });

        }


    });
