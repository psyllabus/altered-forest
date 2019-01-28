$(function () {
    if (window.initData.flashMessage) {
        $('.flashMessage').html('<p>' + window.initData.flashMessage.text + '</p><i class="fas fa-times-circle" id="close">');
        $('.flashMessage').removeClass('hidden');
        if (window.initData.flashMessage.type === 'error') {
            $('.flashMessage').addClass('error');
        }
        else {
            $(".flashMessage").removeClass("error");
        }
        var close = function () {
            $('.flashMessage').addClass('hidden');
            history.pushState({}, 'close flash message', location.pathname) 
        }
        setTimeout(close, 10000);
        $(".flashMessage #close").click(close);
    }
    else {
        $('.flashMessage').addClass('hidden');
    }
});