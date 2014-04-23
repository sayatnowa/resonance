// Generated by CoffeeScript 1.6.2
(function() {
  window.app.controller("TopPagesController", function($scope) {
    var alreadyRequestedTopPage;

    $scope.topPages = [];
    $scope.regexp = '';
    self.port.on('topPages', function(topPages) {
      var i, p, page, pages, s, v, visitors;

      topPages = atob(topPages);
      s = topPages.split(',');
      pages = (function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = s.length; _i < _len; _i += 2) {
          p = s[_i];
          _results.push(p);
        }
        return _results;
      })();
      visitors = (function() {
        var _i, _len, _ref, _results;

        _ref = s.slice(1);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i += 2) {
          v = _ref[_i];
          _results.push(v);
        }
        return _results;
      })();
      if (pages[0].slice(0, 5) === 'begin') {
        $scope.topPages = [];
        pages[0] = pages[0].substring(5);
      }
      $scope.topPages = $scope.topPages.concat((function() {
        var _i, _len, _results;

        _results = [];
        for (i = _i = 0, _len = pages.length; _i < _len; i = ++_i) {
          page = pages[i];
          _results.push([page, visitors[i]]);
        }
        return _results;
      })());
      return $scope.$apply();
    });
    $scope.getTopPages = function() {
      return self.port.emit('getTopPages', $scope.regexp);
    };
    alreadyRequestedTopPage = false;
    return $scope.displayTopPages = function(displayTopPages) {
      if (displayTopPages) {
        if (!alreadyRequestedTopPage) {
          self.port.emit('getTopPages', $scope.regexp);
          alreadyRequestedTopPage = true;
        }
      } else {
        alreadyRequestedTopPage = false;
      }
      return displayTopPages;
    };
  });

}).call(this);
