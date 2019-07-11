// 转码压缩，copy from echarts-map-tools
export default function compressFile(json) {
    json = json || {};
    json = Object.assign({}, json);
    if (json.UTF8Encoding) {
        // tslint:disable-next-line:no-console
        console.log("already compressed");
        return json;
    }
    json.UTF8Encoding = true;

    let features = json.features;
    if (!features) {
        return json;
    }
    features.forEach(function (feature) {
        let encodeOffsets: any[] = feature.geometry.encodeOffsets = [];
        let coordinates = feature.geometry.coordinates;
        if (feature.geometry.type === 'Polygon') {
            coordinates.forEach(function (coordinate, idx) {
                coordinates[idx] = encodePolygon(
                    coordinate, encodeOffsets[idx] = []
                );
            });
        } else if (feature.geometry.type === 'MultiPolygon') {
            coordinates.forEach(function (polygon, idx1) {
                encodeOffsets[idx1] = [];
                polygon.forEach(function (coordinate, idx2) {
                    coordinates[idx1][idx2] = encodePolygon(
                        coordinate, encodeOffsets[idx1][idx2] = []
                    );
                });
            });
        }
    });

    return json;
}

function encodePolygon(coordinate, encodeOffsets) {

    var result = '';

    var prevX = quantize(coordinate[0][0]);
    var prevY = quantize(coordinate[0][1]);
    // Store the origin offset
    encodeOffsets[0] = prevX;
    encodeOffsets[1] = prevY;

    for (var i = 0; i < coordinate.length; i++) {
        var point = coordinate[i];
        result += encode(point[0], prevX);
        result += encode(point[1], prevY);

        prevX = quantize(point[0]);
        prevY = quantize(point[1]);
    }

    return result;
}

function quantize(val) {
    return Math.ceil(val * 1024);
}

function encode(val, prev) {
    // Quantization
    val = quantize(val);
    // var tmp = val;
    // Delta
    val = val - prev;

    if (((val << 1) ^ (val >> 15)) + 64 === 8232) {
        //WTF, 8232 will get syntax error in js code
        val--;
    }
    // ZigZag
    val = (val << 1) ^ (val >> 15);
    // add offset and get unicode
    return String.fromCharCode(val + 64);
}
