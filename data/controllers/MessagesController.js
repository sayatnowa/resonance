app.controller("MessagesController", function($scope){
    
    $scope.messages = [];
    $scope.newMessage = '';
    $scope.pseudo = "Wutwut";
    $scope.submitNewMessage =  function(){
                            $scope.messages.push($scope.pseudo+' : '+$scope.newMessage);
                        };

});
