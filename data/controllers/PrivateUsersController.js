// Generated by CoffeeScript 1.6.2
(function() {
  window.app.controller('PrivateUsersController', function($scope) {
    $scope.currentPmUser = 'Resonance-bot';
    $scope.pmUsers = [];
    $scope.selectPmUser = function(user) {
      self.port.emit('startPmUser', user);
      return self.port.emit('unactivePmUser', user);
    };
    self.port.on("pmUser", function(user, history) {
      return $scope.currentPmUser = user;
    });
    self.port.on("pmUsers", function(users) {
      $scope.pmUsers = users;
      return $scope.$apply();
    });
    $scope["class"] = function(user) {
      return {
        'selected': user === $scope.currentPmUser,
        'active': $scope.activePrivateUsers[user]
      };
    };
    $scope.activePrivateUsers = {};
    return self.port.on('activePrivateUsers', function(users) {
      $scope.activePrivateUsers = users;
      return $scope.$apply();
    });
  });

}).call(this);
