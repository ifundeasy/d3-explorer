var z = undefined;
var source = {
    fields: ['latitude', 'longitude', 'text', 'size', 'color'],
    rows: [
        [107.6431575, -6.9034495, "BDG", 100, 'crimson'],
        [106.829518, -6.2297465, "JKT", 400],
        [108.554039, -6.7428626, "CRB", 5000, 'rgb(197, 176, 213)'],
        [107.908699, -7.227906, "GRT", 40, '#C654D6']
    ],
    fields: ["name", "longitude", "latitude", "text", "size"],
    rows: [["jakarta", "-6.176655999999999", "106.8305839", "jakarta", 10], ["indonesia", "2.8812512", "98.0819866", "indonesia", 9], ["jepang", "-7.0254223", "111.4216267", "jepang", 7], ["jawa barat", "-7.090910999999999", "107.668887", "jawa barat", 2], ["kalimantan", "-0.9450539999999998", "103.6478486", "kalimantan", 2], ["sumatera", "3.585623", "98.5943525", "sumatera", 2]]
};
var doing = function () {
    /**
     * d3.googlemap({})
     * description : class dengan (wajib) parameter objek guna configurasi awal
     * return value : this (googlemap instance) --> reuseable for chaining :D
     * dependencies : JQuery, d3.apply;
     * methods :
     *      .normalize() : return googlemap instance
     *      .normalize(callback) : callback(data, googlemap) { ... }
     *      .redraw() : return googlemap instance
     *      .redraw(callback) : callback(d3_proto, googlemap) { ... }
     *
     */
    var gmap = d3.googlemap({
        parent: '#googlemap-page',
        fields: source.fields,   //wajib di normalize!
        rows: source.rows,     //wajib di normalize!
        //data   : data,            //bentuk yang udah seharusnya dapat langusng di set disini
        latitude: -6.8678485,      //-2.548926, <-- indonesia latitude
        longitude: 107.605138,      //118.0148634, <-- indonesia longitude
        zoom: 8,
        type: 'polosan',       //"roadmap" or "satellite" or "hybrid" or "terrain"
        minSize: 50,              //bullet minimal size
        maxSize: 100,             //bullet maximal size
        fontSize: 12,
        opacity: 0.5,
        events: {                //override event handler (click, mouseover, mouseleave, and contextmenu)
            click: function (el, proto, googlemap) {
                console.log('click', arguments)
            },
            mouseover: function (el, proto, googlemap) {
                console.log('mouseover', arguments)
            },
            contextmenu: function (el, proto, googlemap) {
                console.log('contextmenu', arguments)
            },
        }
    });
    gmap.normalize(function () {
        console.log(arguments)
    });
    gmap.redraw(function () {
        console.log(arguments)
    });
};

z = setInterval(function () {
    if (d3.googlemap) {
        clearInterval(z);
        z = undefined;
        doing();
    }
}, 200);