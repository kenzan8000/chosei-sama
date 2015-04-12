(function(global) {
    "use strict;"

    /**************************************************
     *             TimezoneArrangement                *
     **************************************************/
    function TimezoneArrangement(selectDidChange) {
        var timezoneSelect = $("#timezones");
        var names = moment.tz.names();
        for (var i = 0; i < names.length; i++) {
            var option = $("<option/>").html(names[i]);
            timezoneSelect.append(option);
        }
        timezoneSelect.change(function() {
            TimezoneArrangement_previousTimezoneName = TimezoneArrangement_currentTimezoneName;

            var timezoneName = $(this).val();
            if (timezoneName === "- timezone") { // default timezone
                timezoneName = TimezoneArrangement_defaultTimezoneName();
            }
            TimezoneArrangement_currentTimezoneName = timezoneName;
            selectDidChange();
        });
    };

    /// Member
    TimezoneArrangement["prototype"]["date"] = TimezoneArrangement_date; // TimezoneArrangement#date get date from dateString
    TimezoneArrangement["prototype"]["dateFromUTC"] = TimezoneArrangement_dateFromUTC; // TimezoneArrangement#date get date from dateString(UTC)
    TimezoneArrangement["prototype"]["dateString"] = TimezoneArrangement_dateString; // TimezoneArrangement#dateString get date string from date and timezone

    var TimezoneArrangement_previousTimezoneName = TimezoneArrangement_defaultTimezoneName(); // previous timezone name
    var TimezoneArrangement_currentTimezoneName = TimezoneArrangement_defaultTimezoneName(); // current timezone name

    /// Implementation
    function TimezoneArrangement_date(dateString) {
        var invalid = new Date(dateString);
        if (invalid.toString() === "Invalid Date") { return invalid; }

        var previous = moment.tz(dateString, "YYYY/MM/DD HH:mm", TimezoneArrangement_previousTimezoneName);
        var current = previous.clone().tz(TimezoneArrangement_currentTimezoneName);
        return current.toDate();
    }

    function TimezoneArrangement_dateFromUTC(dateString) {
        var invalid = new Date(dateString);
        if (invalid.toString() === "Invalid Date") { return invalid; }

        var previous = moment.tz(dateString, "YYYY-MM-DD HH:mm UTC", "Etc/UTC");
        var current = previous.clone().tz(TimezoneArrangement_currentTimezoneName);
        return current.toDate();
    }

    function TimezoneArrangement_dateString(date) {
        var m = moment(date);
        m.tz(TimezoneArrangement_currentTimezoneName);
        return m.format("YYYY/MM/DD HH:mm").toString();
    }

    function TimezoneArrangement_defaultTimezoneName() {
        var hourOffset = Math.floor((new Date()).getTimezoneOffset() / 60);
        var timezoneName = (hourOffset > 0) ? "Etc/GMT+"+hourOffset : "Etc/GMT"+hourOffset;
        return timezoneName;
    }

    /// Exports
    if ("process" in global) {
        module["exports"] = TimezoneArrangement;
    }
    global["TimezoneArrangement"] = TimezoneArrangement;

})((this || 0).self || global);
