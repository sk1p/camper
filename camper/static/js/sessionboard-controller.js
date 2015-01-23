// Generated by CoffeeScript 1.8.0
var INTEGER_REGEXP, app, guid, s4;

s4 = function() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

guid = function() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

app = angular.module('barcamptool', ['ui.timepicker', 'ui.sortable']);

app.filter('slice', function() {
  return function(arr, start, end) {
    if (arr) {
      return arr.slice(start, end);
    } else {
      return arr;
    }
  };
});

app.config(function($interpolateProvider) {
  return $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('SessionBoardCtrl', function($scope, $http) {
  $scope.sortableOptions = {
    axis: 'x',
    items: "td",
    placeholder: "sortable-placeholder",
    containment: 'parent',
    opacity: 0.5
  };
  $scope.room = {
    name: '',
    description: '',
    capacity: ''
  };
  $scope.timeslot = {
    time: null,
    blocked: false,
    reason: ''
  };
  $scope.timePickerOptions = {
    step: 15,
    timeFormat: 'G:i',
    minTime: "11:00",
    maxTime: "24:00",
    appendTo: 'body'
  };
  $http.get("sessionboard/data").success(function(data) {
    $scope.rooms = data.rooms;
    $scope.rooms.unshift({});
    return $scope.timeslots = data.timeslots;
  });
  $scope.roomModalMode = "add";
  $scope.room_idx = null;
  $scope.add_room_form = function() {
    $scope.roomModalMode = "add";
    $scope.room = {};
    document.getElementById("add-room-form").reset();
    $('#add-room-modal').modal('show');
    return void 0;
  };
  $scope.add_room = function() {
    if ($scope.room_form.$error.$invalid) {
      return;
    }
    $scope.room.id = guid();
    $scope.rooms.push($scope.room);
    $scope.room = angular.copy($scope.room);
    $('#add-room-modal').modal('hide');
  };
  $scope.edit_room = function(idx) {
    $scope.roomModalMode = "edit";
    $scope.room = angular.copy($scope.rooms[idx]);
    $scope.room_idx = idx;
    $('#add-room-modal').modal('show');
  };
  $scope.update_room = function() {
    if ($scope.room_form.$error.$invalid) {
      return;
    }
    $scope.rooms[$scope.room_idx] = $scope.room;
    $('#add-room-modal').modal('hide');
  };
  $scope.delete_room = function(idx) {
    $scope.rooms.splice(idx, 1);
    return void 0;
  };
  $scope.timeslotModalMode = "add";
  $scope.timeslot_idx = null;
  $scope.add_timeslot_form = function() {
    var d, dd, last_time, new_time;
    $scope.timeslotModalMode = "add";
    document.getElementById("add-timeslot-form").reset();
    if ($scope.timeslots.length) {
      last_time = angular.copy($scope.timeslots[$scope.timeslots.length - 1]).time;
      new_time = new Date(last_time.getTime() + 60 * 60000);
      $scope.timeslot.time = new_time;
    } else {
      d = Date.now();
      dd = new Date();
      dd.setTime(d);
      dd.setHours(9);
      dd.setMinutes(0);
      dd.setSeconds(0);
      $("#timepicker").timepicker('option', 'minTime', '00:00');
      $("#timepicker").timepicker('setTime', dd);
      $scope.timeslot.time = dd;
    }
    $('#add-timeslot-modal').modal('show');
  };
  $scope.add_timeslot = function() {
    if ($scope.timeslot_form.$error.$invalid) {
      return;
    }
    $scope.timeslots.push($scope.timeslot);
    $scope.timeslots = _.sortBy($scope.timeslots, function(item) {
      return item.time;
    });
    $scope.timeslot = angular.copy($scope.timeslot);
    $('#add-timeslot-modal').modal('hide');
    $scope.timeslot.blocked = false;
    $scope.timeslot.reason = "";
  };
  $scope.delete_timeslot = function(idx) {
    $scope.timeslots.splice(idx, 1);
    return void 0;
  };
  $scope.save_to_server = function() {
    var data, rooms;
    rooms = angular.copy($scope.rooms);
    rooms.splice(0, 1);
    data = {
      rooms: rooms,
      timeslots: $scope.timeslots
    };
    $http.post("sessionboard/data", data).success(function(data) {
      return console.log("success");
    }).error(function(data) {
      console.log("error!");
      return console.log(data);
    });
    return console.log(data);
  };
  $scope.$watch('rooms', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      console.log("rooms changes");
      $scope.save_to_server();
    }
    return void 0;
  }, true);
  return $scope.$watch('timeslots', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      console.log("slots changes");
      $scope.save_to_server();
    }
    return void 0;
  }, true);
});

INTEGER_REGEXP = /^[0-9]+$/i;

app.directive('integer', function() {
  return {
    restrict: "AE",
    require: 'ngModel',
    link: function($scope, elm, attrs, ctrl) {
      return ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        if (viewValue.match(INTEGER_REGEXP)) {
          return true;
        }
        return false;
      };
    }
  };
});