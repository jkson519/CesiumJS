let viewer;

document.addEventListener("DOMContentLoaded", function () {
    viewer = initMap();
    earthRotate(true);

    setEventHandler();

    // let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // handler.setInputAction(function (movement) {
    //     const cartesian = viewer.scene.pickPosition(movement.endPosition);
    //     if (cartesian) {
    //         const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    //         const longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
    //         const latitudeString = Cesium.Math.toDegrees(cartographic.latitude);

    //         document.querySelector('#lonlat').innerText = longitudeString + ', ' + latitudeString;
    //     }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    $("#enter").click(function() {
        $("#mainMenu").hide();
        viewer.clock.shouldAnimate = false;
        viewer.clock.currentTime = new Cesium.JulianDate.fromIso8601("2021-09-01T14:00:00+09:00");
        viewer.scene.globe.enableLighting = false;
        viewer.scene.screenSpaceCameraController.enableZoom  = true;
        viewer.scene.postUpdate.removeEventListener(icrf);
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        enterTheEarth();
    });

    $("#leave").click(function() {
        let p = viewer.camera.position;
        let cartographic = Cesium.Cartographic.fromCartesian(p);
        lon = Cesium.Math.toDegrees(cartographic.longitude);
        lat = Cesium.Math.toDegrees(cartographic.latitude);

        viewer.camera.flyTo({
            destination: new Cesium.Cartesian3.fromDegrees(lon, lat, 27128595.79176651),
            duration: 2.5,
            complete: showMainMenu
        });
        function showMainMenu() {
            $("#mainMenu").show();
            viewer.clock.shouldAnimate = true;
        }

        viewer.scene.primitives.removeAll();

        $("#topMenu").hide();

        earthRotate(false);
    });
});

//////// viewer 세팅
function initMap() {
    let viewer = new Cesium.Viewer("mapContainer", {
        terrainProvider: Cesium.createWorldTerrain({
            requestVertexNormals : true
        }),
        requestRenderMode: true,
        timeline: false,
        animation: false,
        infoBox: false,
        selectionIndicator: false,
        fullscreenButton: false,
        shouldAnimate: false,
    });

    // 지도 마우스 조작 방식 변경
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
    viewer.scene.screenSpaceCameraController.rotateEventTypes = [Cesium.CameraEventType.LEFT_DRAG];

    // 지구 구체 색상 검은색으로 변경 (기본 파란색)
    viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1);

    // 안개 농도 조절 / default 0.0002 / 0에 가까워질수록 투명
    viewer.scene.fog.density = 0.0001;

    // 불필요한 Cesium 기본 메뉴 미표시
    document.querySelector(".cesium-viewer-bottom").style.display = "none";
    document.querySelector(".cesium-viewer-toolbar").style.display = "none";

    return viewer;
}

//////// 메인 화면 지구 자전
function icrf(scene, time) {
    if (scene.mode !== Cesium.SceneMode.SCENE3D) {
        return;
    }

    let icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
    if (Cesium.defined(icrfToFixed)) {
        let camera = viewer.camera;
        let offset = Cesium.Cartesian3.clone(camera.position);
        let transform = Cesium.Matrix4.fromRotationTranslation(
            icrfToFixed
        );
        camera.lookAtTransform(transform, offset);
    }
}

function earthRotate(bCheck) {
    viewer.scene.postUpdate.addEventListener(icrf);
    viewer.clock.multiplier = 4800;
    viewer.clock.shouldAnimate = bCheck;
    viewer.clock.currentTime = new Cesium.JulianDate.fromIso8601("2021-09-01T14:00:00+09:00");
    viewer.scene.globe.enableLighting = true;

    // 메인 화면 마우스 줌 방지
    viewer.scene.screenSpaceCameraController.enableZoom = false;
}

//////// 메인 화면에서 지구로 진입
function enterTheEarth() {
    viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(126.92506486721677, 37.525008965586515, 4000),
        duration: 2.5,
        complete: loadNext
    });

    function loadNext() {
        // OSM 건물 추가
        let tileset = Cesium.createOsmBuildings();
        tileset.readyPromise.then(function (tileset) {
            viewer.scene.primitives.add(tileset);
        });
    
        // 상단 메뉴 show
        $("#topMenu").show();
    }
}

//////// direction, up 사용해서 원하는 카메라 pitch 상태로 시점 이동
// function calcDestination(cartesian, direction, distance) {
//     let X = cartesian.x - direction.x * distance;
//     let Y = cartesian.y - direction.y * distance;
//     let Z = cartesian.z - direction.z * distance;

//     return new Cesium.Cartesian3(X, Y, Z);
// }

// function flyTo() {
//     let car = new Cesium.Cartesian3.fromDegrees(126.92506486721677, 37.524108965586515);
//     let dir = new Cesium.Cartesian3(0.5499906479789742, -0.7370889485018234, -0.39269602637682044);

//     viewer.camera.flyTo({
//         destination: calcDestination(car, dir, 3500),
//         orientation: {
//             direction: new Cesium.Cartesian3(0.5499906479789742, -0.7370889485018234, -0.39269602637682044),
//             up: new Cesium.Cartesian3(0.22606498001937553, -0.3212568483490482, 0.9196133221075454),
//         },
//         duration: 3.0,
//     });
// }