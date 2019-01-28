$(function () {
    ClassicEditor.create(document.querySelector('.contact #body'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo'],
    });
});

function validateContactForm() {
    var err = false;
    
    if (!$('form #sender').val() || !$('form #sender').val().length) {
        $('form #sender').addClass('error');
        err = true;
    }
    
    if (!$('form #subject').val() || !$('form #subject').val().length) {
        $('form #subject').addClass('error');
        err = true;
    }

    if (err) {
        return false;
    }
    return true;
}
