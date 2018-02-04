var menu = [
    {
        title: 'Item #1',
        action: function (elm, d, i) {
            console.log('Item #1 clicked!');
            console.log('The data for this circle is: ' + d);
        }
    },
    {
        title: 'Item #2',
        action: function (elm, d, i) {
            console.log('You have clicked the second item!');
            console.log('The data for this circle is: ' + d);
        }
    }
];
var source = {
    fields: ['lvl0', 'lvl1', 'lvl2', 'size'],
    rows: [
        ["A1", "A11", "A111", (Math.random() * 1000)],
        ["A1", "A11", "A112", (Math.random() * 1000)],
        ["A1", "A11", "A113", (Math.random() * 1000)],
        ["A1", "A12", "A121", (Math.random() * 1000)],
        ["A1", "A12", "A122", (Math.random() * 1000)],
        ["A1", "A13", "A131", (Math.random() * 1000)],

        ["A2", "A21", "A211", (Math.random() * 1000)],
        ["A2", "A21", "A212", (Math.random() * 1000)],
        ["A2", "A21", "A213", (Math.random() * 1000)],
        ["A2", "A22", "A221", (Math.random() * 1000)],
        ["A2", "A22", "A222", (Math.random() * 1000)],
        ["A2", "A23", "A231", (Math.random() * 1000)],

        ["A3", "A31", "A311", (Math.random() * 1000)],
        ["A3", "A31", "A312", (Math.random() * 1000)],
        ["A3", "A31", "A313", (Math.random() * 1000)],
        ["A3", "A32", "A321", (Math.random() * 1000)],
        ["A3", "A32", "A322", (Math.random() * 1000)],
        ["A3", "A33", "A331", (Math.random() * 1000)],
    ]
};

/**
 * d3.sunburst({})
 * description : class dengan (wajib) parameter objek guna configurasi awal
 * return value : this (sunburst instance) --> reuseable for chaining :D
 * dependencies : JQuery, d3.apply;
 * methods :
 *      .normalize() : return sunburst instance
 *      .normalize(callback) : callback(data, sunburst) { ... }
 *      .redraw() : return sunburst instance
 *      .redraw(callback) : callback(d3_proto, sunburst) { ... }
 *
 */
var sb = d3.sunburst({
    parent: '#sunburst-page',
    fields: source.fields,     //wajib di normalize!
    rows: source.rows,       //wajib di normalize!
    //data  : undefined,       //bentuk yang udah seharusnya dapat langusng di set disini
    gradation: 0.5,
    delay: 2000,              //animation time
    fontSize: 10,             //label font size
    events: {            //override event handler (click, mouseover, mouseleave, and contextmenu)
        click: function (el, proto, sunburst) {
            console.log('click', arguments)
        },
        mouseover: function (el, proto, sunburst) {
            console.log('mouseover', arguments)
        },
        contextmenu: d3.contextMenu(menu, function () {
            console.log('Quick! Before the menu appears!');
        })
    }
})
.normalize()
.redraw(function () {
    console.log(arguments)
});