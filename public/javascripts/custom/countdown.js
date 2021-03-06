$(function () {
    var DATE = new Date('2019-08-16T12:00:00')
    var $countdown = $('#countdown');
    var $counts = {
        nbDays: $countdown.find('#days .count'),
        nbHours: $countdown.find('#hours .count'),
        nbMin: $countdown.find('#minutes .count'),
        nbSec: $countdown.find('#seconds .count')
    }
    var $date = $('#event-date');
    var langToLocale = { en: 'en-US', fr: 'fr-CA' };
    $date.text(DATE.toLocaleDateString(langToLocale[window.initData.lang], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    function getRemainingTimeTo(date) {
        var now = new Date();

        var SEC = 1000;
        var MIN = 60 * SEC;
        var HOUR = 60 * MIN;
        var DAY = 24 * HOUR;
        var duration = date - now;
        var nbDays = Math.floor(duration / DAY);
        var nbHours = Math.floor((duration - nbDays * DAY) / HOUR);
        var nbMin = Math.floor((duration - nbDays * DAY - nbHours * HOUR) / MIN);
        var nbSec = Math.floor((duration - nbDays * DAY - nbHours * HOUR - nbMin * MIN) / SEC);

        return {
            nbSec: nbSec,
            nbMin: nbMin,
            nbHours: nbHours,
            nbDays: nbDays
        };
    }

    function updateCounters(prop) {
        var remaining = getRemainingTimeTo(DATE);
        var display = parseInt($counts[prop].text(), 10);
        if (display > remaining[prop]) {
            $counts[prop].text(display - 1);
        }
        else if (display !== remaining[prop]) {
            $counts[prop].text(remaining[prop]);
        }
        var diff = display - remaining[prop];

        if (diff === 0 && prop === 'nbSec') {
            setTimeout(function () { updateCounters(prop); }, 100);
        }
        else if (diff !== 0) {
            setTimeout(function () { updateCounters(prop); }, 500 / diff);
        }
        else {
            setTimeout(function () { updateCounters(prop); }, 1000);
        }
    }

    updateCounters("nbDays");
    updateCounters("nbHours");
    updateCounters("nbMin");
    updateCounters('nbSec');
});
