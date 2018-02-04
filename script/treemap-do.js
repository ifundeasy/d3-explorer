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

/**
 * d3.treemap({})
 * description : class dengan (wajib) parameter objek guna configurasi awal
 * return value : this (treemap instance) --> reuseable for chaining :D
 * dependencies : JQuery, d3.apply;
 * methods :
 *      .normalize() : return treemap instance
 *      .normalize(callback) : callback(data, treemap) { ... }
 *      .redraw() : return treemap instance
 *      .redraw(callback) : callback(d3_proto, treemap) { ... }
 *
 */
var treemap = d3.treemap({
    name: 'tod',
    parent: '#treemap-page',
    padding: 5,
    /*
    preprocess: function (me) {
        var medias = [];
        me.rows.forEach(function (row) {
            if (medias.indexOf(row[0]) === -1) medias.push(row[0])
        });
        me.rows = medias.sort().map(function (media) {
            var group = me.rows.filter(function (row) {
                return row[0] === media
            });

            return  [media, null, group.map(function (row) {
                return row[2]
            }).reduce(function (p, n, a) {
                return p + n;
            })]
        }).sort(function(p, n){
            return n[2] - p[2]
        }).slice(0,10);
    },
    rowIdx: { parent: 1, child: 0, value: 2 },
    */
    rowIdx: {parent: 0, child: 1, value: 2},
    events: {
        click: function (el, proto, treemap) {
            //console.log('click', arguments)
        },
        mouseover: function (el, proto, treemap) {
            //console.log('mouseover', arguments)
        },
        contextmenu: d3.contextMenu(menu, function () {
            //console.log('Quick! Before the menu appears!');
        })
    }
});
$.getJSON('data/treemap.json', function (res) {
    var data = res.compare;
    d3.apply(treemap, {
        fields: data.fields,
        rows: data.rows
    });
    treemap.normalize(function (data) {
        //console.log(JSON.stringify(data, 0, 2))
    });
    treemap.redrawCompare(function () {
        //console.log(arguments)
    });
})