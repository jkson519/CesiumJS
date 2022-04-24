function initMap() {
    //// viewer 세팅
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

    //// 기본 시간 설정
    viewer.clock.currentTime = new Cesium.JulianDate.fromIso8601("2021-09-01T14:00:00+09:00");
    viewer.defaultScenePostUpdate = viewer.scene.postUpdate;
    //// OpenStreetMap 3D 건물 레이어 로드
    let tileset = Cesium.createOsmBuildings();
    tileset.readyPromise.then(function (tileset) {
        viewer.scene.primitives.add(tileset);
    });

    //// 지도 마우스 조작 방식 변경
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
    viewer.scene.screenSpaceCameraController.rotateEventTypes = [Cesium.CameraEventType.LEFT_DRAG];

    //// 지구 구체 색상 검은색으로 변경 (기본 파란색)
    viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1);

    //// 하늘 밝기 조절 / default 0
    viewer.scene.skyAtmosphere.brightnessShift = 0.3;

    //// 안개 농도 조절 / default 0.0002 / 0에 가까워질수록 투명
    viewer.scene.fog.density = 0.0001;

    //// 불필요한 Cesium 기본 메뉴 미표시
    document.querySelector(".cesium-viewer-bottom").style.display = "none";
    document.querySelector(".cesium-viewer-toolbar").style.display = "none";

    //// 기본 카메라 저장
    viewer.defaultCamera = viewer.camera;

    //// 지구 자전 카메라 세팅
    // function icrf(scene, time) {
    //     if (scene.mode !== Cesium.SceneMode.SCENE3D) {
    //         return;
    //     }
    
    //     let icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
    //     if (Cesium.defined(icrfToFixed)) {
    //         let camera = viewer.camera;
    //         let offset = Cesium.Cartesian3.clone(camera.position);
    //         let transform = Cesium.Matrix4.fromRotationTranslation(
    //             icrfToFixed
    //         );
    //         camera.lookAtTransform(transform, offset);
    //     }
    // }
    viewer.scene.postUpdate.addEventListener(icrf);
    viewer.clock.multiplier = 4800;
    viewer.clock.shouldAnimate = true;
    viewer.scene.globe.enableLighting = true;

    //// 변경된 카메라 저장
    viewer.changedCamera = viewer.camera;

    //// 초기 화면 마우스 이벤트 방지
    viewer.scene.screenSpaceCameraController.enableZoom  = false;
    // viewer.scene.screenSpaceCameraController.enableInputs = false;

    return viewer;
}

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