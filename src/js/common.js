let viewer;

document.addEventListener("DOMContentLoaded", function () {
    viewer = initMap();

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
        viewer.scene.globe.enableLighting = false;
        viewer.scene.screenSpaceCameraController.enableZoom  = true;
        viewer.camera = viewer.defaultCamera;
        // viewer.scene.postUpdate = viewer.defaultScenePostUpdate;
        viewer.scene.postUpdate.removeEventListener(icrf);
        // zoomToKorea();
    });
});

    //// 여의도
    // let car = new Cesium.Cartesian3.fromDegrees(126.92704944513494, 37.52247476835369);
    // let dir = new Cesium.Cartesian3(0.2914709827634589, -0.9304513801656011, 0.22204705662276064);
    // viewer.camera.setView({
    //     destination: positionFromLook(car, dir, 3000),
    //     orientation: {
    //         direction: new Cesium.Cartesian3(0.2914709827634589, -0.9304513801656011, 0.22204705662276064),
    //         up: new Cesium.Cartesian3(-0.377071322777594, 0.10157501552320726, 0.9205974873744854),
    //     },
    //     duration: 5.0,
    // });

    function positionFromLook(cartesian, direction, distance) {
        let X = cartesian.x - direction.x * distance;
        let Y = cartesian.y - direction.y * distance;
        let Z = cartesian.z - direction.z * distance;
    
        return new Cesium.Cartesian3(X, Y, Z);
    }
    
    function zoomToKorea() {
        let car = new Cesium.Cartesian3.fromDegrees(126.92704944513494, 37.52647476835369);
        let dir = new Cesium.Cartesian3(0.13220323955527702, -0.8350246666281285, 0.5340937273303937);
        viewer.camera.flyTo({
            destination: positionFromLook(car, dir, 3000),
            orientation: {
                direction: new Cesium.Cartesian3(0.13220323955527702, -0.8350246666281285, 0.5340937273303937),
                up: new Cesium.Cartesian3(-0.4579282815442733, 0.4264248402412264, 0.7800407326461571),
            },
            duration: 7.0,
        });
    }