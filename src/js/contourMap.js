$(document).ready(function () {
    $('#contourMap').on('click', function () {
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            $('#contourMapMenu').show();
        } else {
            $('#contourMapMenu').hide();
        }
    });

    // UnitTest용 임시 코드
    var bShow;

    $("#contourMap").click(function () {
        var pVal = 100; // C#에서 기본값으로 100 받아옴

        $(".lineSpaceCheck").prop("checked", true); // Contour Map 실행 시 등고선 on/off 체크박스는 항상 checked
        $(".lineSpaceInput").val(pVal); // Contour Map 실행 시 등고선 간격 설정 기본값은 항상 50

        var bChecked = true; // C#에서 기본값으로 true 받아옴
        if (bShow == undefined) {
            bShow = true;
            $('.lineSpace').show();
        } else if (bShow == true) {
            bShow = false;
            $('.lineSpace').hide();
        } else {
            bShow = true;
            $('.lineSpace').show();
        }
        IGF_updateMaterial(bShow, pVal, bChecked);
    });

    $(".lineSpaceCheck").change(function () {
        var pVal = $(".lineSpaceInput").val();

        if ($(".lineSpaceCheck").is(":checked")) {
            contourLineSwitch(true, pVal);
        } else {
            contourLineSwitch(false);
        }
    })

    $(".lineSpaceBtn").click(function () {
        var pVal = $(".lineSpaceInput").val();
        setContourLineSpace(pVal);
    });
});

function getElevationContourMaterial() {
    return new Cesium.Material({
        fabric: {
            type: "ElevationColorContour",
            materials: {
                contourMaterial: {
                    type: "ElevationContour",
                },
                elevationRampMaterial: {
                    type: "ElevationRamp",
                },
            },
            components: {
                diffuse:
                    "contourMaterial.alpha == 0.0 ? elevationRampMaterial.diffuse : contourMaterial.diffuse",
                alpha:
                    "max(contourMaterial.alpha, elevationRampMaterial.alpha)",
            },
        },
        translucent: false,
    });
}

let elevationRamp = [0.0, 0.15, 0.4, 0.65, 0.9, 1.0];
function getColorRamp(selectedShading) {
    let ramp = document.createElement("canvas");
    ramp.width = 100;
    ramp.height = 1;
    let ctx = ramp.getContext("2d");

    let values;
    if (selectedShading === "elevation") {
        values = elevationRamp;
    }
    
    let grd = ctx.createLinearGradient(0, 0, 100, 0);
    grd.addColorStop(values[0], "#0012FF"); // 파랑
    grd.addColorStop(values[1], "#029F00"); // 초록
    grd.addColorStop(values[2], "#FFFF00"); // 노랑
    grd.addColorStop(values[3], "#FF6F00"); // 주황
    grd.addColorStop(values[4], "#FF0000"); // 빨강
    grd.addColorStop(values[5], "#FFFFFF"); // 흰색

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 0.5);

    return ramp;
}

let minHeight = 0;
let maxHeight = 1250.0;
let contourColor = Cesium.Color.BLACK.clone();
let contourUniforms = {};
let shadingUniforms = {};

const viewModel = {
    enableContour: true,
    contourSpacing: 100.0,
    contourWidth: 3.0,
    selectedShading: "elevation",
};

function IGF_updateMaterial(bShow, pVal, bChecked) {
    let material;

    if (bShow == true) {
        const selectedShading = viewModel.selectedShading;

        if (bChecked) {
            if (selectedShading === "elevation") {
                material = getElevationContourMaterial();
                shadingUniforms = material.materials.elevationRampMaterial.uniforms;
                shadingUniforms.minimumHeight = minHeight;
                shadingUniforms.maximumHeight = maxHeight;
                contourUniforms = material.materials.contourMaterial.uniforms;
            }
            contourUniforms.width = viewModel.contourWidth;
            contourUniforms.spacing = Number(pVal);
            contourUniforms.color = contourColor.withAlpha(1.0);
        } else if (selectedShading === "elevation") {
            material = Cesium.Material.fromType("ElevationRamp");
            shadingUniforms = material.uniforms;
            shadingUniforms.minimumHeight = minHeight;
            shadingUniforms.maximumHeight = maxHeight;
        }

        if (selectedShading !== "none") {
            shadingUniforms.image = getColorRamp(selectedShading);
        }
    }

    viewer.scene.globe.material = material;
    viewer.scene.render();
}

function contourLineSwitch(bChecked, pVal) {
    IGF_updateMaterial(true, pVal, bChecked);
}

function setContourLineSpace(pVal) {
    IGF_updateMaterial(true, pVal, true);
    viewer.scene.render();
}