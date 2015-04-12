(function(global) {
    "use strict;"

    var attendanceForm;
    var timezoneArrangement;

    /**************************************************
     *                AttendanceForm                  *
     **************************************************/
    function AttendanceForm() {
        // when form is posted
        $("#attendance-form").submit(function(event) {
            AttendanceForm_post();
            event.preventDefault();
        });
    };

    /// Member
    AttendanceForm["prototype"]["post"] = AttendanceForm_post; // AttendanceForm#post post form data
    var AttendanceForm_datePickers = new Array(); // date pickers

    /// Implementation
    function AttendanceForm_post() {
        var form = $("#attendance-form :input");
        var json = {"attendances":{}};
        form.each(function() {
            var prefix = "attendance_";
            if (this.name.indexOf(prefix) === 0) {
                if (this.checked) {
                    var dateId = this.name.substring(prefix.length);
                    json["attendances"][dateId] = $(this).val();
                }
            }
            else { json[this.name] = $(this).val(); }
        });
        $.ajax({
            type: "POST",
             url: "/schedule_attendance",
            data: JSON.stringify(json),
     contentType: "application/json; charset=utf-8",
        dataType: "json",
         success: function(data){
            window.location.href = data["redirect_url"];
         },
         failure: function(error) { console.log(error); }
        });
    }

    /// Exports
    if ("process" in global) {
        module["exports"] = AttendanceForm;
    }
    global["AttendanceForm"] = AttendanceForm;


    /**************************************************
     *                                                *
     **************************************************/
    $(function(){
        // delete request (schedule, user)
        var deleteRequest = function(api, id) {
            $.ajax({
                type: "POST",
                 url: "/"+api+"/"+id,
                data: null,
         contentType: "application/json; charset=utf-8",
            dataType: "json",
             success: function(data){
                window.location.href = data["redirect_url"];
             },
             failure: function(error) { console.log(error); }
            });
        };
        $(".delete-schedule-button").click(function() {
            if (confirm("Delete schedule?")) { deleteRequest("delete_schedule", this.id.substring("schedule-".length)); }
        });
        $(".delete-schedule-user-button").click(function() {
            if (confirm("Delete this user?")) { deleteRequest("delete_schedule_user", this.id.substring("schedule-user-".length)); }
        });
        // callback to arrange timezone
        var arrangeTimezone = function() {
            $(".attendance-date").each(function() {
                var date = timezoneArrangement.date($(this).html());
                if (date.toString() !== "Invalid Date") {
                    $(this).html(timezoneArrangement.dateString(date));
                }
            });
        };

        // attendance form
        attendanceForm = new AttendanceForm();
        // timezone
        timezoneArrangement = new TimezoneArrangement(arrangeTimezone);

        // set default timezone
        $(".attendance-date").each(function() {
            var date = timezoneArrangement.dateFromUTC($(this).html());
            if (date.toString() !== "Invalid Date") {
                $(this).html(timezoneArrangement.dateString(date));
            }
        });
    });

})((this || 0).self || global);
