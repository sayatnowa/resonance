app.controller("MainController", function($scope){
    
    $scope.resonance = ['Try resonance :'];
    $scope.message = "Chat.";
    $scope.pseudo = "Wutwut";
    $scope.addNew =  function(){
                            $scope.resonance.push($scope.message);
                        };
    $scope.del =  function(msg){
                            var index = $scope.resonance.indexOf(msg);
                            $scope.resonance.splice(index,1);
                        };

});
app.controller("FriendController", function($scope){
    $scope.list = ['Empty'];
    $scope.friend = "One friend.";
    $scope.addNew =  function(){
                            $scope.list.push($scope.friend);
                        };
    $scope.del =  function(msg){
                            var index = $scope.list.indexOf(msg);
                            $scope.list.splice(index,1);
                        };

});
