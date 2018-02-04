d3.json("data/market.json", function (error, data) {
    var line = d3.dimple({
        parent: '#line-page',
        fields: data.fields, //wajib di normalize
        rows: data.rows, //wajib di normalize
        //data  : undefined, //kalo udah punya bentuk data yang seharusnya
        ease: 'sin', //linear or poly or quad or cubic or sin or exp or circle or elastic or back or bounce
        delay: 1000,
        gridline: {
            color: '#FF0000',
            hidden: true,
        },
        /*
         bound : {
         xCoor : '50',
         yCoor : '50',
         width : '505',
         height: '305'
         },
         */
        legend: {
            xCoor: '0',
            yCoor: '0',
            width: '505',
            height: '305',
            align: 'right', //left or right
        },
        colors: [
            {
                key: 'Hypermarkets',
                color: d3.paquesColor.random(),
            },
            {
                key: 'Supermarkets',
                color: d3.paquesColor.random(),
            }
        ],
        series: [
            /*{
             type  : 'bar', //area or bar or bubble or line or pie
             key   : "Channel", //data key
             radius: 'cardinal' //interpolation -->>> cardinal or #$%^&*()??
             },*/
            {
                type: 'line', //area or bar or bubble or line or pie
                key: 'Channel', //data key
                radius: 'cardinal' //interpolation -->>> cardinal or #$%^&*()??
            }
        ],
        axes: [
            {
                type: 'category', //category or measure or pct or color or log
                axis: 'x', //x or y or x1 (x top) or y1 (y right)
                order: 'Date', //data key
                //hidden: true,
                key: 'Month' //data key
            },
            {
                type: 'measure', //category or measure or pct or color or log
                axis: 'y', //x or y or x1 (x top) or y1 (y right)
                hidden: false,
                key: 'Unit Sales' //data key
            }
        ]
    })
    .normalize()
    .redraw()
});