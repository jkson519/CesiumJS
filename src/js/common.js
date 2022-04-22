// function mainPage() {
//     let delay = 2000;
//     $('#line1').animate({
//         opacity: '1'
//     }, delay, function () {
//         $('#line2').animate({
//             opacity: '1'
//         }, delay, function () {
//             $('#line3').animate({
//                 opacity: '1'
//             }, delay);
//         });
//     });
// }

$(document).ready(function () {
    $('#mainPage').on('click', function () {
        $(this).hide();
        zoomToEarth();
    });
});

function addClass(element, className) {
    element.className += " " + className;
};

function removeClass(element, className) {
    let check = new RegExp("(\\s|^)" + className + "(\\s|$)");
    element.className = element.className.replace(check, " ").trim();
};

/*
<RegExp 설명>
className의 앞 공백(\\s)이나 문자열의 시작(^), 뒤 공백(\\s)이나 문자열의 끝($)을 " " 공백으로 바꾼다.
위 과정이 반복되면서 불필요한 공백이 늘어나는 것을 방지하기 위해서 trim() 함수를 사용해서 맨 앞 또는 맨 뒤의 공백을 제거한다.

replace(className)을 사용하지 않는 이유는 예를 들어 현재 className이 "hamburger ham" 인 경우 replace(ham)를 사용하면
앞에 있는 hamburger의 ham이 삭제되어 "burger ham" 이 되는, 원하지 않는 결과가 발생할 수 있기 때문이다.
*/

function toggleClass(element, className) { 
    let check = new RegExp("(\\s|^)" + className + "(\\s|$)");
    if (check.test(element.className)) {
        element.className = element.className.replace(check, " ").trim();
    } else {
        element.className += " " + className;
    }
}