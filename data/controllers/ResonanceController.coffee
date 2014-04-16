window.app.controller "ResonanceController", ($scope) ->
    # Indicates which element of the application has to be displayed.
    # 1 for messages.
    # 2 for features.
    # 3 fot settings.
    # Initialized with messages.
    $scope.display = 1

    $scope.mutedUser = []

    # List of users with which a private conversation has been started.
    $scope.pmUsers = ['Resonance-bot']
    # Which user we're displaying in the private messages panel.
    $scope.currentPmUser = 'Resonance-bot'

    self.port.on 'appSize',(height) ->
        # Set the size of the app.
        angular.element('#resonance_container').height height

    # Resizing feature.
    $scope.resizing = false
    # This event is binded to body, but I can"t find the way to unbind it !
    # .off raises an angularjs error, and this resizing var is the only workaround I found.
    angular.element('body').on 'mousemove', (e) ->
        # If the user is currentl resizing.
        if $scope.resizing
            # Get the desired height from where is the mouse on the screen.
            newHeight = window.innerHeight-e.clientY
            # Update the DOM element.
            angular.element('#resonance_container').height newHeight
            # Tell the background script so it can save the value.
            self.port.emit('newAppSize',newHeight)
    

    $scope.selectPmUser = (user) ->
        $scope.currentPmUser = user
        $scope.$broadcast('pmUser',user)