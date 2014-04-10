
app.controller('UsersController', function($scope){
<<<<<<< HEAD
    $scope.users = [];
    self.port.on("names", function (channel,nicks) {
            for (nick in nicks){
                $scope.users.push(nick);
            };
            $scope.users.splice($scope.users.indexOf(IRC.nick),1); //it will be added by the 'joined' event
            $scope.$apply()
        });
    self.port.on("joined", function (channel,nick) {
            $scope.users.push(nick);
            $scope.$apply()

        });
    self.port.on("left", function (channel,nick) {
            $scope.users.splice($scope.users.indexOf(nick),1);
            $scope.$apply()
        });
});
=======
    $scope.users = ['NoOne','Really'];
	$scope.addNew =  function(name){
        $scope.users.push(name);
    };
    $scope.del =  function(name){
        var index = $scope.list.indexOf(name);
        $scope.users.splice(index,1);
    };
});
>>>>>>> db31a35746a79fffd4b30f184d3ce8e5b9d2c8f2
