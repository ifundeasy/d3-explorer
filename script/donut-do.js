var source = {
    fields: ['text', 'size', 'color'],
    rows: [
        ["pin bb", 92716, 'crimson'],
        ["Mobiles", 91940, 'rgb(197, 176, 213);'],
        ["Chelsea", 91940],
        ["Madrit", 167160, 'aquamarine'],
        ["Hai", 157939, '#C654D6'],

        ["2AB09477", 86354],
        ["HOODIE", 44321],
        ["PRE", 98374],
        ["ARSENAL", 55160],
        ["minat", 66739]
    ]
};

/**
 * d3.pie({})
 * description : class dengan (wajib) parameter objek guna configurasi awal
 * return value : this (pie instance) --> reuseable for chaining :D
 * dependencies : JQuery, d3.apply;
 * methods :
 *      .normalize() : return pie instance
 *      .normalize(callback) : callback(data, pie) { ... }
 *      .redraw() : return pie instance
 *      .redraw(callback) : callback(d3_proto, pie) { ... }
 *
 */
var pie = d3.donut({
    parent: '#donut-page',
    fields: source.fields,   //wajib di normalize!
    rows: source.rows,     //wajib di normalize!
    //data  : undefined,       //bentuk yang udah seharusnya dapat langusng di set disini
    events: {                //override event handler (click, mouseover, mouseleave, and contextmenu)
        click: function (el, proto, pie) {
            console.log('click', arguments)
        },
        mouseover: function (el, proto, pie) {
            console.log('mouseover', arguments)
        },
        contextmenu: function (el, proto, pie) {
            console.log('contextmenu', arguments)
        },
    }
});
pie.normalize();
pie.redraw(function () {
    console.log(arguments)
});
