$(document).ready(function () {
    $('#contourMap').on('click', function () {
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            $('#contourMapMenu').show();
        } else {
            $('#contourMapMenu').hide();
        }
    });
});