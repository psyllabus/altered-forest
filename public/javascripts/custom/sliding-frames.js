$(function () {
    $('.sliding-frames').each(function () {
        var $el = $(this);
        var $prevControl = $el.find('.previous');
        var $nextControl = $el.find('.next');
        var getNbSlides = function () {
            return $el.find('.framed-text').length;
        };
        var getCurrentSlide = function () {
            var classes = $el[0].classList.value;
            if (!classes) { return 0; }
            var matches = /translate-(\d)/.exec(classes);
            if (!matches || matches.length < 2) { return 0; }
            return parseInt(matches[1], 10);
        };
        var hideIrrelevantControls = function (currentSlide, nbSlides) {
            currentSlide = currentSlide || getCurrentSlide();
            nbSlides = nbSlides || getNbSlides();
            if (currentSlide === 0) {
                $prevControl.addClass('hidden');
            }
            else {
                $prevControl.removeClass('hidden');
            }
            if (currentSlide === nbSlides - 1) {
                $nextControl.addClass("hidden");
            } else {
                $nextControl.removeClass('hidden');
            }
        };
        var getOnClickControlHandler = function (side) {
            return function () {
                var currentSlide = getCurrentSlide();
                var nextSlide = currentSlide + (side === "next" ? 1 : -1);
                var nbSlides = getNbSlides();
                var newClass = "translate-" + nextSlide;
                $el.addClass(newClass);
                $el.removeClass(function (index, className) {
                    return className.split(' ').filter(function(c) {
                        return c !== newClass && c.startsWith('translate-')
                    });
                });
                hideIrrelevantControls(nextSlide, nbSlides);
            }
        };

        var currentSlide = getCurrentSlide();
        setTimeout(function () {
            $el.removeClass('translate-' + currentSlide);
            hideIrrelevantControls()
            $prevControl.click(getOnClickControlHandler("previous"));
            $nextControl.click(getOnClickControlHandler('next'));
        }, 100)
    });
});