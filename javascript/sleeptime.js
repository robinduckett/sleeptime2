window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var oldValue;

function updateSleepTimes() {
    $('span.time').each(function(index) {
        var alarm = moment()
                    .add(14, 'minutes')
                    .add((index*1.5) + 4.5, 'hours');

        $(this).html(alarm.format('h:mm a'));
    });

    setTimeout(updateSleepTimes, 10000);
}

function changeWatcher() {
    var newValue = $('#customTime').val();

    if (oldValue !== newValue) {
        oldValue = newValue;

        $('#customEnabled').removeAttr('disabled');
    }

    requestAnimationFrame(changeWatcher);
}

$(function() {
    var current = moment(Date.now());

    oldValue = $('#customTime').val();

    updateSleepTimes();

    requestAnimationFrame(changeWatcher);

    $('#customEnabled').change(function() {
        if ($(this).prop('checked')) {
            $('#customTime').prop('disabled', true);

            var now = moment(Date.now()),
                time = $('#customTime').val(),
                hours = time.split(':')[0],
                minutes = time.split(':')[1];

            var wakeTime = moment(now),
                sleepTime = moment(now);

            wakeTime.hours(hours).minutes(minutes);

            if (hours > now.hours()) {
                waketime = now.hours(hours).minutes(minutes);
            } else {
                waketime = now.add(1, 'day').hours(hours).minutes(minutes);
            }

            var difference = waketime.diff(moment(Date.now()), 'hours', true);

            if (difference < 1.5) {
                waketime = now.add(1, 'day').hours(hours).minutes(minutes);
            }

            var sleeptime = moment(waketime);

            if (difference > 9) {
                sleeptime.subtract(9, 'hours');
            } else {
                for (var i = difference.toFixed(0); i > 0; i-=1.5) {
                    sleeptime.subtract(90, 'minutes');
                }
            }

            sleeptime.subtract(14, 'minutes');

            $('p.bedtime').html('You should go to bed at ' + sleeptime.format('h:mm a') + '.<br><small>You will get ' + waketime.subtract(14, 'minutes').diff(sleeptime, 'hours', true).toFixed(2) + ' hours of sleep.');

            $('p.bedtime').fadeIn();
        } else {
            $('#customTime').prop('disabled', false);
            $('p.bedtime').fadeOut();
        }
    });
});
