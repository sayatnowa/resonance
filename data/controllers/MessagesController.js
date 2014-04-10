app.controller("MessagesController", function($scope){
    
    $scope.messages = [];
    $scope.newMessage = '';
<<<<<<< HEAD
    var elmt = angular.element('#messages .list') ;
    
    $scope.submitNewMessage =  function(){
                            self.port.emit('say',IRC.chan, $scope.newMessage);
                        };

    self.port.on("message", function (from,to,message) {
        var text = from+' : '+message;
        $scope.messages.push(text)
        $scope.$apply()
        // scroll down
        elmt.animate({ scrollTop: elmt.prop('scrollHeight')}, 1000);
        
        
    });

});
=======
    $scope.pseudo = "Wutwut";
    $scope.submitNewMessage =  function(){
                            $scope.messages.push($scope.pseudo+' : '+$scope.newMessage);
                        };

});
>>>>>>> db31a35746a79fffd4b30f184d3ce8e5b9d2c8f2
