$(document).ready(function () {
    // 일조 기능 버튼 클릭
    $('#sun').on('click', function () {
        // 지구로 줌인
        // let car = new Cesium.Cartesian3.fromDegrees(126.92704944513494, 37.52647476835369);
        // let dir = new Cesium.Cartesian3(0.4752851565279563, -0.6324136878984561, -0.6116836987715714);
        // viewer.camera.flyTo({
        //     destination: positionFromLook(car, dir, 20000),
        //     orientation: {
        //         direction: new Cesium.Cartesian3(0.4752851565279563, -0.6324136878984561, -0.6116836987715714),
        //     up: new Cesium.Cartesian3(0.3674924661813898, -0.4889849022646707, 0.7911024286760411),
        //     },
        //     duration: 5.0,
        //     // complete: doSomething()
        // });
        // zoomToEarth();

        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            $('#sunControlMenu').show();

            // date input에 현재 날짜 반영
            let timezoneOffset = new Date().getTimezoneOffset() * 60000;
            let timezoneDate = new Date(Date.now() - timezoneOffset);
            $('#sunDate').val(timezoneDate.toISOString().substring(0, 10));
            
            // 옵션 초기화
            $('#sunSlider').val(43200);
            $('#sunTime').text('12시 00분');
            $('#sunSpeed').val(1);

            // 일조 실행/종료 시 그림자 기능 on
            shadowOnOff(true);
        } else {
            $('#sunControlMenu').hide();
            
            // 일조 실행/종료 시 그림자 기능 off
            shadowOnOff(false);
        }
    });

    // 날짜 변경 시 변경 날짜와 슬라이더 시간에 맞게 태양 위치 변경
    $('#sunDate').on('change', function () {
        let dateVal = $('#sunDate').val();
        let sliderVal = $('#sunSlider').val();
        let sunSpeed = $('#sunSpeed').val();
        
        if ($('#sunPlay').hasClass('on')) {
            sunSimulationStop();
            $('#sunPlay').text('■');
            $('#sunPlay').addClass('on');
            sunSimulationPlay(dateVal, sliderVal, sunSpeed);
        } else {
            changeDate(dateVal, sliderVal);
        }
    });

    // 재생속도 변경
    $('#sunSpeed').on('change', function () {
        let dateVal = $('#sunDate').val();
        let sliderVal = $('#sunSlider').val();
        let sunSpeed = $(this).val();
        if ($('#sunPlay').hasClass('on')) {
            sunSimulationStop();
            $('#sunPlay').text('■');
            $('#sunPlay').addClass('on');
            sunSimulationPlay(dateVal, sliderVal, sunSpeed);
        }
    });

    // 재생유지 체크박스
    $('#keepPlay').on('change', function () {
        if ($(this).is(":checked")) {
            $(this).addClass('on');
        } else {
            $(this).removeClass('on');
        }
    });

    // 일조 시뮬레이션
    $('#sunPlay').on('click', function () {
        $(this).toggleClass('on');
        
        if ($(this).hasClass('on')) {
            let dateVal = $('#sunDate').val();
            let sliderVal = $('#sunSlider').val();
            let sunSpeed = $('#sunSpeed').val();
            $('#sunDate').attr('disabled', true);
            $('#sunPlay').text('■');
            sunSimulationPlay(dateVal, sliderVal, sunSpeed);
        } else {
            $('#sunDate').attr('disabled', false);
            $('#sunPlay').text('▶');
            sunSimulationStop();
        }
    });

    // 슬라이더 기능
    $('#sunSlider').on('mousedown', function () {
        $(this).addClass('down');
        
        $(this).on('mousemove', function () {
            $(this).removeClass('down');
            $(this).addClass('move');
            let dateVal = $('#sunDate').val();
            let sliderVal = $('#sunSlider.move').val();
            if ($('#sunPlay').hasClass('on')) {
                sunSimulationStop();
                $('#sunPlay').text('■');
                $('#sunPlay').addClass('on');
                changeDate(dateVal, sliderVal);
            } else {
                changeDate(dateVal, sliderVal);
            }
        });
        
        if ($(this).hasClass('down')) {
            if ($('#sunPlay').hasClass('on')) {
                let dateVal = $('#sunDate').val();
                let sliderVal = $('#sunSlider.down').val();
                sunSimulationStop();
                $('#sunPlay').text('■');
                $('#sunPlay').addClass('on');
                changeDate(dateVal, sliderVal);
            }
        }
    });
    $('#sunSlider').on('mouseup', function () {
        if ($(this).hasClass('move')) {
            $(this).removeClass('move');
        } else if ($(this).hasClass('down')) {
            $(this).removeClass('down');
        }
        let dateVal = $('#sunDate').val();
        let sliderVal = $('#sunSlider').val();
        let sunSpeed = $('#sunSpeed').val();
        if ($('#sunPlay').hasClass('on')) {
            sunSimulationPlay(dateVal, sliderVal, sunSpeed);
        } else {
            changeDate(dateVal, sliderVal);
        }
        $(this).off('mousemove');
    });
});

let sunPlay;
let sunStop = false;

function sunSimulationPlay(dateVal, sliderVal, sunSpeed) {
	sunStop = false;
	let saveDate;
	
	let intervalSpeed = 20;
	
	let changeVal = Number(sliderVal);
	sunPlay = setInterval(function () {
		if (!sunStop) {
			changeVal += sunSpeed*30;
			if ($('#keepPlay').hasClass('on')) {
				if (saveDate != undefined) {
					dateVal = saveDate;
				}
				if (changeVal < 86399) {
					$('#sunDate').val(dateVal);
					changeDate(dateVal, changeVal);
					$('#sunSlider').val(changeVal);
				} else {
					changeVal = 0;
					let nextDate = new Date(dateVal);
					nextDate.setDate(nextDate.getDate() + 1);
					saveDate = nextDate.toISOString().substring(0, 10);
				}
			} else {
				if (changeVal < 86399) {
					changeDate(dateVal, changeVal);
					$('#sunSlider').val(changeVal);
				} else {
					$('#sunSlider').val(86399);
					$('#sunTime').text('23시 59분');
					sunSimulationStop();
				}
			}
		}
	}, intervalSpeed);
}

function sunSimulationStop() {
	clearInterval(sunPlay);
	sunStop = true;
	$('#sunPlay').text('▶');
	$('#sunPlay').removeClass('on');
    $('#sunDate').attr('disabled', false);
}

function changeDate(dateVal, sliderVal) {
	let hourStr = timeCalc(sliderVal).hourStr;
	let minStr = timeCalc(sliderVal).minStr;
	let currentTime = dateVal + "T" + hourStr + ":" + minStr + ":00" + "+09:00";
	viewer.clock.currentTime = new Cesium.JulianDate.fromIso8601(currentTime);
	$('#sunTime').text(hourStr + '시 ' + minStr + '분');
}

function shadowOnOff(bVisible) {
    viewer.clock.currentTime = new Cesium.JulianDate.fromIso8601("2021-09-25T14:00:00+09:00");
	viewer.scene.globe.enableLighting = bVisible;
	viewer.shadows = bVisible;
    viewer.shadowMap.size = 4096; // default : 2048
    viewer.shadowMap.maximumDistance = 100000; // default : 5000
    viewer.terrainShadows = bVisible ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
	
	viewer.scene.render();
}

function timeCalc(val) {
	let hours = Math.floor(val / 3600);
	let mins = Math.floor((val - (hours * 3600))/60);

	let hourStr = (hours > 9)? hours : '0' + hours
	let minStr = (mins > 9)? mins : '0' + mins
			
	return {hourStr : hourStr,
			minStr : minStr};
}

function flyTo() {
    let center = getCenterPoint();
    let carto = Cesium.Cartographic.fromCartesian(center);
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, 5000),
    });
}

function getCenterPoint(){
    let windowPosition = new Cesium.Cartesian2(viewer.container.clientWidth / 2, viewer.container.clientHeight / 2);
    let pickRay = viewer.scene.camera.getPickRay(windowPosition);
    if(!Cesium.defined(pickRay)) return;
    let center = viewer.scene.globe.pick(pickRay, viewer.scene);
    return center;
}