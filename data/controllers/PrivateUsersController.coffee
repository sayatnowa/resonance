window.app.controller 'PrivateUsersController', ($scope)->
    # List of every present user.
    $scope.currentPmUser = 'Resonance-bot'
    $scope.pmUsers = []

    # When the user clicks on a user in the list.
    $scope.selectPmUser = (user) ->
        # Propagate to other tabs via the background
        self.port.emit( 'startPmUser', user)
        # Update the notifications
        self.port.emit('unactivePmUser',user)
    
    # When a user is selected.
    self.port.on "pmUser", (user, history) ->
        $scope.currentPmUser = user
    
    # When the list of private conversations is updated.
    self.port.on "pmUsers", (users) ->
        $scope.pmUsers = users
        $scope.$apply()

    # Set the css class
    $scope.class = (user)->
        { 'selected': user == $scope.currentPmUser, 'active':$scope.activePrivateUsers[user]}

    # Raise the notification when a new private message is waiting.
    $scope.activePrivateUsers = {}
    self.port.on 'activePrivateUsers', (users) ->
        $scope.activePrivateUsers = users
        $scope.$apply()