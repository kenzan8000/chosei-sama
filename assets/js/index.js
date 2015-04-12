(function(global) {
    "use strict;"

    var scheduleForm;
    var timezoneArrangement;

    /**************************************************
     *                 ScheduleForm                   *
     **************************************************/
    function ScheduleForm() {
        // when form is posted
        $("#schedule-form").submit(function(event) {
            event.preventDefault();
            ScheduleForm_post();
        });
    };

    /// Member
    ScheduleForm["prototype"]["initDatepicker"] = ScheduleForm_initDatepicker; // ScheduleForm#initDatepicker initialize date picker
    ScheduleForm["prototype"]["addDatePicker"] = ScheduleForm_addDatePicker; // ScheduleForm#addDatePicker add date picker
    ScheduleForm["prototype"]["post"] = ScheduleForm_post; // ScheduleForm#post post form data
    var ScheduleForm_datePickers = new Array(); // date pickers

    /// Implementation
    function ScheduleForm_initDatepicker(datePicker) {
        var currentDate = new Date();
        var minDate = new Date(currentDate.getTime() + 24*60*60*1000*1);
        var maxDate = new Date(currentDate.getTime() + 24*60*60*1000*31);
        datePicker.datetimepicker({
            defaultTime:currentDate.getHours() + ":00",
            minDate:minDate,
            maxDate:maxDate,
            closeOnTimeSelect:true,
            step:30
        });
    }

    function ScheduleForm_addDatePicker() {
        // add, remove button
        var addButton = $("<div/>").addClass("add-button").attr("id", "add-button");
        addButton.append($("<i/>").addClass("fa fa-plus"));
        var removeButton = $("<div/>").addClass("remove-button").attr("id", "remove-button");
        removeButton.append($("<i/>").addClass("fa fa-minus"));
        // br
        var br = $("<br/>");
        // date picker
        var dates = $("#dates");
        var datePicker = $("<input/>").addClass("date datepicker").attr("type", "text").attr("readonly", "readonly").attr("name", "date");
        datePicker.addButton = addButton;
        datePicker.removeButton = removeButton;
        datePicker.br = br;

        // add dom elements
        dates.append(datePicker);
        var length = ScheduleForm_datePickers.length;
        for (var i = 0; i < length; i++) {
            ScheduleForm_datePickers[i].addButton.remove();
            ScheduleForm_datePickers[i].removeButton.remove();
        }
        dates.append(datePicker);
        if (length > 0) { dates.append(addButton); }
        if (length > 1) { dates.append(removeButton); }
        dates.append(br);

        // event listener
        $("#add-button").click(function() { ScheduleForm_addDatePicker(); });
        $("#remove-button").click(function() { ScheduleForm_removeDatePicker(); });

        ScheduleForm_initDatepicker(datePicker);
        ScheduleForm_datePickers.push(datePicker);
    }

    function ScheduleForm_removeDatePicker() {
        var DATEPICKER_LENGTH_MIN = 2;
        if (ScheduleForm_datePickers.length <= DATEPICKER_LENGTH_MIN) { return; }

        // remove dom elements
        for (var i = 0; i < ScheduleForm_datePickers.length; i++) {
            ScheduleForm_datePickers[i].addButton.remove();
            ScheduleForm_datePickers[i].removeButton.remove();
        }
        var datePicker = ScheduleForm_datePickers.pop();
        datePicker.addButton.remove();
        datePicker.removeButton.remove();
        datePicker.br.remove();
        datePicker.remove();

        // renew the last element
        var dates = $("#dates");
        datePicker = ScheduleForm_datePickers[ScheduleForm_datePickers.length - 1];
        datePicker.br.remove();
        dates.append(datePicker.addButton);
        if (ScheduleForm_datePickers.length > DATEPICKER_LENGTH_MIN) { dates.append(datePicker.removeButton); }
        dates.append(datePicker.br);

        // event listener
        $("#add-button").click(function() { ScheduleForm_addDatePicker(); });
        $("#remove-button").click(function() { ScheduleForm_removeDatePicker(); });
    }

    function ScheduleForm_post() {
        var form = $("#schedule-form :input");
        var json = {"dates":[]};
        form.each(function() {
            if (this.name == "date") {
                var dateString = (timezoneArrangement.date($(this).val())).toUTCString();
                if (dateString !== "Invalid Date") {
                    json["dates"].push(dateString);
                }
            }
            else { json[this.name] = $(this).val(); }
        });
        $.ajax({
            type: "POST",
             url: "/schedule",
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
        module["exports"] = ScheduleForm;
    }
    global["ScheduleForm"] = ScheduleForm;


    /**************************************************
     *                                                *
     **************************************************/
    $(function(){
        // schedule form
        scheduleForm = new ScheduleForm();
        var DATEPICKER_LENGTH_MIN = 2;
        for (var i = 0; i < DATEPICKER_LENGTH_MIN; i++) {
            scheduleForm.addDatePicker();
        }
        // timezone
        timezoneArrangement = new TimezoneArrangement(function() {
            var form = $("#schedule-form :input");
            form.each(function() {
                if (this.name == "date") {
                    var date = timezoneArrangement.date($(this).val());
                    if (date.toString() !== "Invalid Date") {
                        $(this).val(timezoneArrangement.dateString(date));
                    }
                }
            });
        });
    });
})((this || 0).self || global);
