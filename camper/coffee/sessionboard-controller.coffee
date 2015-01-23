s4 = () ->
    Math.floor((1 + Math.random()) * 0x10000)
           .toString(16)
           .substring(1)

guid = () ->
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4()

app = angular.module('barcamptool', ['ui.timepicker', 'ui.sortable']);

app.filter 'slice', () ->
    return (arr, start, end) ->
        if arr 
            return arr.slice(start, end)
        else
            return arr


app.config ($interpolateProvider) ->
    $interpolateProvider
    .startSymbol('{[{')
    .endSymbol('}]}')


app.controller 'SessionBoardCtrl', ($scope, $http) ->

    # set some defaults

    $scope.sortableOptions =
        axis: 'x'
        items: "td"
        placeholder: "sortable-placeholder"
        containment: 'parent'
        opacity: 0.5

    $scope.room = {
        name: '',
        description: '',
        capacity: ''
    }
    $scope.timeslot = {
        time: null,
        blocked: false,
        reason: ''
    }

    $scope.timePickerOptions =
        step: 15
        timeFormat: 'G:i'
        minTime: "11:00"
        maxTime: "24:00"
        appendTo: 'body'

    # load initial data from server
    $http.get("sessionboard/data").success (data) ->
        $scope.rooms = data.rooms
        $scope.rooms.unshift({})
        $scope.timeslots = data.timeslots
            
    #
    # room related
    #

    $scope.roomModalMode = "add"
    $scope.room_idx = null # for remembering which room to update

    $scope.add_room_form = () ->
        $scope.roomModalMode = "add"
        $scope.room = {}
        document.getElementById("add-room-form").reset()
        $('#add-room-modal').modal('show')
        undefined

    $scope.add_room = () ->
        if $scope.room_form.$error.$invalid
            return
        $scope.room.id = guid()
        $scope.rooms.push($scope.room)
        $scope.room = angular.copy($scope.room)
        $('#add-room-modal').modal('hide')
        return

    $scope.edit_room = (idx) ->
        $scope.roomModalMode = "edit"
        $scope.room = angular.copy($scope.rooms[idx])
        $scope.room_idx = idx        
        $('#add-room-modal').modal('show')
        return
    
    $scope.update_room = () ->
        if $scope.room_form.$error.$invalid
            return
        $scope.rooms[$scope.room_idx] = $scope.room
        $('#add-room-modal').modal('hide')
        return
        
    $scope.delete_room = (idx) ->
        $scope.rooms.splice(idx,1)
        undefined


    #
    # timeslot related
    #

    $scope.timeslotModalMode = "add"
    $scope.timeslot_idx = null # for remembering which timeslot to update

    $scope.add_timeslot_form = () ->
        $scope.timeslotModalMode = "add"
        document.getElementById("add-timeslot-form").reset()

        # pre-set the next possible time
        if $scope.timeslots.length
            last_time = angular.copy($scope.timeslots[$scope.timeslots.length-1]).time
            new_time = new Date(last_time.getTime() + 60*60000)
            $scope.timeslot.time = new_time
        else
            d = Date.now() # TODO: set the date of the day of the event
            dd = new Date()
            dd.setTime(d)
            dd.setHours(9)
            dd.setMinutes(0)
            dd.setSeconds(0)
            $("#timepicker").timepicker('option', 'minTime', '00:00')
            $("#timepicker").timepicker('setTime', dd)
            $scope.timeslot.time = dd

        $('#add-timeslot-modal').modal('show')
        return

    $scope.add_timeslot = () ->

        if $scope.timeslot_form.$error.$invalid
            return
        $scope.timeslots.push($scope.timeslot)

        $scope.timeslots = _.sortBy($scope.timeslots, (item) -> 
            item.time
        )

        $scope.timeslot = angular.copy($scope.timeslot)
        $('#add-timeslot-modal').modal('hide')
        $scope.timeslot.blocked = false
        $scope.timeslot.reason = ""
        return

    $scope.delete_timeslot = (idx) ->
        $scope.timeslots.splice(idx,1)
        undefined

    $scope.save_to_server = () ->
        # clean up rooms
        rooms = angular.copy($scope.rooms)
        rooms.splice(0,1) # remove first empty element
        data = 
            rooms: rooms
            timeslots: $scope.timeslots
        $http.post("sessionboard/data", data).success (data) ->
            console.log "success"
        .error (data) ->
            console.log "error!"
            console.log data            
        console.log data

    $scope.$watch( 'rooms', (newValue, oldValue) ->
        if newValue != oldValue
            console.log "rooms changes"
            $scope.save_to_server()
        undefined
    , true)

    $scope.$watch( 'timeslots', (newValue, oldValue) ->
        if newValue != oldValue
            console.log "slots changes"
            $scope.save_to_server()
        undefined
    , true)
          
INTEGER_REGEXP = ///^
    [0-9]+
    $///i

# we only catch . here, the rest is done by the default validator
app.directive('integer', () ->
    return {
        restrict: "AE",
        require: 'ngModel',
        link: ($scope, elm, attrs, ctrl) ->
            ctrl.$validators.integer = (modelValue, viewValue) ->
                if ctrl.$isEmpty(modelValue)
                    return true
                if viewValue.match INTEGER_REGEXP
                    return true
                
                # it is invalid
                return false
    }
)

