function initMap() {
    // viewer 세팅
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
        // skyBox: new Cesium.SkyBox({
        //     sources: {
        //         positiveX: "../../src/images/skybox/px.png",
        //         negativeX: "../../src/images/skybox/nx.png",
        //         positiveY: "../../src/images/skybox/ny.png",
        //         negativeY: "../../src/images/skybox/py.png",
        //         positiveZ: "../../src/images/skybox/pz.png",
        //         negativeZ: "../../src/images/skybox/nz.png",
        //     }
        // })
    });

    // 기본 시간 설정
    viewer.clock.currentTime = new Cesium.JulianDate.fromIso8601("2021-09-25T14:00:00+09:00");

    // 카메라 시작 위치 설정
    //// 우주
    // viewer.camera.setView({
    //     destination: new Cesium.Cartesian3(-23826840410.039978, 31703956683.09707, 30459446292.082268),
    //     orientation: {
    //         direction: new Cesium.Cartesian3(0.4752851565279563, -0.6324136878984561, -0.6116836987715714),
    //         up: new Cesium.Cartesian3(0.3674924661813898, -0.4889849022646707, 0.7911024286760411),
    //     },
    // });
    // warp(viewer);

    //// 여의도
    let car = new Cesium.Cartesian3.fromDegrees(126.92704944513494, 37.52247476835369);
    let dir = new Cesium.Cartesian3(0.2914709827634589, -0.9304513801656011, 0.22204705662276064);
    viewer.camera.setView({
        destination: positionFromLook(car, dir, 3000),
        orientation: {
            direction: new Cesium.Cartesian3(0.2914709827634589, -0.9304513801656011, 0.22204705662276064),
            up: new Cesium.Cartesian3(-0.377071322777594, 0.10157501552320726, 0.9205974873744854),
        },
        duration: 5.0,
    });

    // OpenStreetMap 3D 건물 레이어 로드
    let tileset = Cesium.createOsmBuildings();
    tileset.readyPromise.then(function (tileset) {
        viewer.scene.primitives.add(tileset);
    });

    // 지도 마우스 조작 방식 변경
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
    viewer.scene.screenSpaceCameraController.rotateEventTypes = [Cesium.CameraEventType.LEFT_DRAG];

    // viewer.scene.globe.depthTestAgainstTerrain = true;

    // 지구 구체 색상 검은색으로 변경 (기본 파란색)
    viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1);

    // 하늘 밝기 조절 / default 0
    viewer.scene.skyAtmosphere.brightnessShift = 0.3;

    // 안개 농도 조절 / default 0.0002 / 0에 가까워질수록 투명
    viewer.scene.fog.density = 0.0001;


    // 불필요한 Cesium 기본 메뉴 미표시
    document.querySelector('.cesium-viewer-bottom').style.display = 'none';
    document.querySelector('.cesium-viewer-toolbar').style.display = 'none';

    return viewer;
}

function positionFromLook(cartesian, direction, distance) {
    let X = cartesian.x - direction.x * distance;
    let Y = cartesian.y - direction.y * distance;
    let Z = cartesian.z - direction.z * distance;

    return new Cesium.Cartesian3(X, Y, Z);
}

function zoomToEarth() {
    let car = new Cesium.Cartesian3.fromDegrees(126.92704944513494, 37.42647476835369);
    let dir = new Cesium.Cartesian3(0.4752851565279563, -0.6324136878984561, -0.6116836987715714);
    viewer.camera.flyTo({
        destination: positionFromLook(car, dir, 30000),
        orientation: {
            direction: new Cesium.Cartesian3(0.4752851565279563, -0.6324136878984561, -0.6116836987715714),
            up: new Cesium.Cartesian3(0.3674924661813898, -0.4889849022646707, 0.7911024286760411),
        },
        duration: 5.0,
        complete: function () {
            setTimeout(function () {
                let car = new Cesium.Cartesian3.fromDegrees(126.92704944513494, 37.52247476835369);
                let dir = new Cesium.Cartesian3(0.2914709827634589, -0.9304513801656011, 0.22204705662276064);
                viewer.camera.flyTo({
                    destination: positionFromLook(car, dir, 3000),
                    orientation: {
                        direction: new Cesium.Cartesian3(0.2914709827634589, -0.9304513801656011, 0.22204705662276064),
                        up: new Cesium.Cartesian3(-0.377071322777594, 0.10157501552320726, 0.9205974873744854),
                    },
                    duration: 5.0,
                    complete: function () {
                        $('#topMenu').show();
                        setTimeout(function () {
                            let tileset = Cesium.createOsmBuildings();
                            tileset.readyPromise.then(function (tileset) {
                                viewer.scene.primitives.add(tileset);
                            });
                        }, 0);
                        viewer.scene.render();
                    }
                });
            }, 0);
            viewer.scene.render();
        },
    });
    viewer.scene.render();
}

// function zoomToKorea() {
//     let car = new Cesium.Cartesian3.fromDegrees(126.92704944513494, 37.52647476835369);
//     let dir = new Cesium.Cartesian3(0.13220323955527702, -0.8350246666281285, 0.5340937273303937);
//     viewer.camera.flyTo({
//         destination: positionFromLook(car, dir, 3000),
//         orientation: {
//             direction: new Cesium.Cartesian3(0.13220323955527702, -0.8350246666281285, 0.5340937273303937),
//             up: new Cesium.Cartesian3(-0.4579282815442733, 0.4264248402412264, 0.7800407326461571),
//         },
//         duration: 5.0,
//     });
// }