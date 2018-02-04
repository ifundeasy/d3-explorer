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
    fields: ["Jan", "Feb", "Mar", "20151209", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    rows: [
        ["", "Feb", "", "Apr", "May", "Jun", "", "Aug", "", "Oct", "Nov", "Dec"],
        ["Jan", "Feb", "", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        ["Jan", "Feb", "", "Apr", "", "", "", "Aug", "", "Oct", "", "Dec"],
        ["Jan", "Feb", "", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "", "Nov", ""]
    ]
};

/**
 * d3.carousel({})
 * description : class dengan (wajib) parameter objek guna configurasi awal
 * return value : this (carousel instance) --> reuseable for chaining :D
 * dependencies : JQuery, d3.apply;
 * methods :
 *      .normalize() : return carousel instance
 *      .normalize(callback) : callback(data, carousel) { ... }
 *      .redraw() : return carousel instance
 *      .redraw(callback) : callback(d3_proto, carousel) { ... }
 *
 */
var carousel = d3.carousel({
    parent: '#carousel-page',
    slideInterval: false,
    steps: 3,
    events: { //ga akan nge-fek, belum gw invoke ke class
        click: function (data, proto, carousel, element) {
            console.log(arguments)
        }
    }
});

d3.apply(carousel, source); //add-field, add-row
carousel
.normalize()
.redraw(function () {
    console.log(arguments)
});