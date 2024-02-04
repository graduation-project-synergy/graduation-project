var size = 0;
var placement = 'point';
function createTextStyle (feature, resolution, labelText, labelFont, labelFill, placement, bufferColor, bufferWidth, textAlign, offsetX, offsetY) {
    var textStyle = new ol.style.Text({
        text: labelText,
        font: labelFont,
        fill: new ol.style.Fill({ color: labelFill }),
        offsetX: offsetX,
        offsetY: offsetY,
        placement: placement,
        maxAngle: 45,
        overflow: true,
        rotation: 0,
        textBaseline: 'bottom'
    });

    return textStyle;
}

const poiPointStyle = function(feature, resolution){
    var labelText = feature.get('NAME')
    size = 0;
    var labelFont = "13.0px \'Open Sans\', sans-serif";
    var labelFill = "#323232";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = "left";
    var offsetX = 8;
    var offsetY = 3;
    var placement = 'point';
    if ("" !== null) {
        labelText = String("");
    }
    var style = [ new ol.style.Style({
        image: new ol.style.Circle({radius: 4.0 + size,
            stroke: new ol.style.Stroke({color: 'rgba(255,255,255,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1}), fill: new ol.style.Fill({color: 'rgb(255,156,156)'})}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
            labelFill, placement, bufferColor,
            bufferWidth, textAlign, offsetX, offsetY)
    })];

    return style;
};
export default poiPointStyle;