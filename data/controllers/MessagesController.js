// Generated by CoffeeScript 1.6.2
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.app.controller("MessagesController", function($scope) {
    var elmt;

    $scope.messages = [];
    $scope.newMessage = '';
    self.port.on("messagesHistory", function(messagesHistory) {
      var message;

      return $scope.messages = (function() {
        var _i, _len, _ref, _results;

        _results = [];
        for (_i = 0, _len = messagesHistory.length; _i < _len; _i++) {
          message = messagesHistory[_i];
          _results.push({
            'author': message.author,
            'message': message.message,
            'display': !(_ref = message.author, __indexOf.call($scope.$parent.mutedUsers, _ref) >= 0)
          });
        }
        return _results;
      })();
    });
    elmt = angular.element('messages > ul');
    $scope.submitNewMessage = function() {
      var msg;

      msg = $scope.newMessage;
      if (msg !== '') {
        self.port.emit('say', IRC.chan, msg);
      }
      return $scope.newMessage = '';
    };
    self.port.on("message", function(from, to, message) {
      var entry;

      entry = {
        'author': from,
        'message': message,
        'display': !(__indexOf.call($scope.$parent.mutedUsers, from) >= 0)
      };
      $scope.messages.push(entry);
      $scope.$apply();
      return elmt.animate({
        scrollTop: elmt.prop('scrollHeight')
      }, 1000);
    });
    $scope.$parent.$on("mute", function(e, user) {
      var message, _i, _len, _ref;

      _ref = $scope.messages;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (message.author === user) {
          message.display = false;
        }
      }
      return elmt.animate({
        scrollTop: elmt.prop('scrollHeight')
      }, 1000);
    });
    return $scope.$parent.$on("unMute", function(e, user) {
      var message, _i, _len, _ref;

      _ref = $scope.messages;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (message.author === user) {
          message.display = true;
        }
      }
      return elmt.animate({
        scrollTop: elmt.prop('scrollHeight')
      }, 1000);
    });
  });

}).call(this);