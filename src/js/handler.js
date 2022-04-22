var arrLeftClick = [];
var arrThematicLeftClick = [];
var arrUnderLeftClick = [];
var arrCropLeftClick = [];

var arrLeftDoubleClick = [];
var arrCropLeftDoubleClick = [];

var arrMouseMove = [];
var arrMarkerMouseMove = [];
var arrCropMouseMove = [];

var arrWheel = [];
//var arrRightClick = [];
//event element = [allAddrArea_WL,slopeMode_LC,slopeMode_MM,
//addrMarker_MM,addrMarker_LC,,placeMarker_MM,placeMarker_LC,searchConMarker_MM,searchConMarker_LC,menuConMarker_MM,menuConMarker_LC,allConMarker_MM,allConMarker_LC,
//setDrawing_LC,setDrawing_MM,setDrawing_LDC,setVIewHeight_LC,selectedFeatuerEvent_LC,setWalkingViewMode_LC]


function debounce(fn, delay) {
	var timer = null;
	return function () {
		var context = this,
			args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

function eventArrayPush(arr, pString) {
	if (arr.length != 0) {
		if (arr.includes(pString)) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == pString) {
					arr.splice(i, 1);
					arr.push(pString);
				}
			}
		} else {
			arr.push(pString);
		}
	} else {
		arr.push(pString);
	}
}

function eventArrayRemove(arr, pString) {
	if (arr.includes(pString)) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == pString) {
				arr.splice(i, 1);
			}
		}
	}
}

function setEventHandler() {
	var Cesiumhandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	var markerHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	var thematicHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	var underHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	var cropHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	// 왼쪽 클릭
	Cesiumhandler.setInputAction(function(event) {
		arrLeftClick.forEach(function(element) {
			(new Function(element + '(' + event.position.x + ',' + event.position.y + ')'))();
		});
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	
	thematicHandler.setInputAction(function(event) {
		arrThematicLeftClick.forEach(function(element) {
			(new Function(element + '(' + event.position.x + ',' + event.position.y + ')'))();
		});
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	
	underHandler.setInputAction(function(event) {
		arrUnderLeftClick.forEach(function(element) {
			(new Function(element + '(' + event.position.x + ',' + event.position.y + ')'))();
		});
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	
	cropHandler.setInputAction(function(event) {
		arrCropLeftClick.forEach(function(element) {
			(new Function(element + '(' + event.position.x + ',' + event.position.y + ')'))();
		});
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	
	// 왼쪽 더블 클릭
	Cesiumhandler.setInputAction(function(event) {
		if (arrLeftDoubleClick.length != 0) {
			for (var i = 0; i < arrLeftDoubleClick.length; i++) {
				(new Function(arrLeftDoubleClick[i] + '()'))();
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
	
	cropHandler.setInputAction(function(event) {
		if (arrCropLeftDoubleClick.length != 0) {
			for (var i = 0; i < arrCropLeftDoubleClick.length; i++) {
				(new Function(arrCropLeftDoubleClick[i] + '()'))();
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

	// 마우스 무브
//	Cesiumhandler.setInputAction(function(event) {
//		if (arrMouseMove.length != 0) {
//			for (var i = 0; i < arrMouseMove.length; i++) {
//				if (arrMouseMove[i].includes('Marker_MM')) {
//					console.log('aa');
//					debounce((new Function(arrMouseMove[i] + '(' + event.endPosition.x + ',' + event.endPosition.y + ')'))(), 0);
//				} else {
//					console.log('bb');
//					(new Function(arrMouseMove[i] + '(' + event.endPosition.x + ',' + event.endPosition.y + ')'))();
//				}
//			}
//		}
//	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	Cesiumhandler.setInputAction(function(event) {
		if (arrMouseMove.length != 0) {
			for (var i = 0; i < arrMouseMove.length; i++) {
				(new Function(arrMouseMove[i] + '(' + event.endPosition.x + ',' + event.endPosition.y + ')'))();
			}
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	
	markerHandler.setInputAction(debounce(event => {
		if (arrMarkerMouseMove.length != 0) {
			for (var i = 0; i < arrMarkerMouseMove.length; i++) {
				(new Function(arrMarkerMouseMove[i] + '(' + event.endPosition.x + ',' + event.endPosition.y + ')'))();
			}
		}
	}, 0), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	
	cropHandler.setInputAction(debounce(event => {
		if (arrCropMouseMove.length != 0) {
			for (var i = 0; i < arrCropMouseMove.length; i++) {
				(new Function(arrCropMouseMove[i] + '(' + event.endPosition.x + ',' + event.endPosition.y + ')'))();
			}
		}
	}, 0), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	
	// 휠
	Cesiumhandler.setInputAction(function(event) {
		if (arrWheel.length != 0) {
			for (var i = 0; i < arrWheel.length; i++) {
				(new Function(arrWheel[i] + '()'))();
			}
		}
	}, Cesium.ScreenSpaceEventType.WHEEL);
	
	// 오른쪽 클릭
//	Cesiumhandler.setInputAction(function(event) {
//		arrRightClick.foreach(function(element) {
//			(new Function(element + '(' + event.position.x + ',' + event.position.y + ')'))();
//		});
//	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}