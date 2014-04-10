
app.controller('UsersController', function($scope){
    $scope.users = ['NoOne','Really'];
	$scope.addNew =  function(name){
        $scope.users.push(name);
    };
    $scope.del =  function(name){
        var index = $scope.list.indexOf(name);
        $scope.users.splice(index,1);
    };
});
