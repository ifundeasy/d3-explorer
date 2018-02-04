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
    fields: ["person2", "cnt"],
    rows: [
        ["AIRIN RACHMI DIANY", 50],
        ["TUBAGUS CHAERI WARDANA", 13],
        ["AIRIN RACHMY DIANI", 7],
        ["IKHSAN MODJO", 6],
        ["PRIHARSA NUGRAHA", 6],
        ["RATU ATUT CHOSIYAH", 6],
        ["MUHAMMAD AWALUDDIN", 5],
        ["STEFANUS UUN", 4],
        ["IVAN AJIE PURWANTO", 4],
        ["PERKASA SUPRIJATNA TAMARA", 4]
    ]
};
var data = [
    {"className": "AIRIN RACHMI DIANY", "value": 50},
    {"className": "TUBAGUS CHAERI WARDANA", "value": 13},
    {"className": "AIRIN RACHMY DIANI", "value": 7},
    {"className": "IKHSAN MODJO", "value": 6},
    {"className": "PRIHARSA NUGRAHA", "value": 6},
    {"className": "RATU ATUT CHOSIYAH", "value": 6},
    {"className": "MUHAMMAD AWALUDDIN", "value": 5},
    {"className": "ARSID", "value": 4},
    {"className": "IVAN AJIE PURWANTO", "value": 4},
    {"className": "STEFANUS UUN", "value": 4}
];
/**
 * d3.bubble({})
 * description : class dengan (wajib) parameter objek guna configurasi awal
 * return value : this (bubble instance) --> reuseable for chaining :D
 * dependencies : JQuery, d3.apply;
 * methods :
 *      .normalize() : return bubble instance
 *      .normalize(callback) : callback(data, bubble) { ... }
 *      .redraw() : return bubble instance
 *      .redraw(callback) : callback(d3_proto, bubble) { ... }
 *
 */
var bubble = d3.bubble({
    parent: '#bubble-page',
    padding: 10,
    events: {
        click: function (el, proto, bubble) {
            console.log('click', arguments)
        },
        mouseover: function (el, proto, bubble) {
            console.log('mouseover', arguments)
        },
        contextmenu: d3.contextMenu(menu, function () {
            console.log('Quick! Before the menu appears!');
        })
    }
});

d3.apply(bubble, source); //add-field, add-row
bubble.normalize().redraw(function () {
    console.log(arguments)
});