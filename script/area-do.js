d3.json("data/market.json", function (error, data) {
    var area = d3.dimple({
        parent: '#area-page',
        fields: data.fields, //wajib di normalize
        rows: data.rows, //wajib di normalize
        //data  : undefined, //kalo udah punya bentuk data yang seharusnya
        ease: 'sin', //linear or poly or quad or cubic or sin or exp or circle or elastic or back or bounce
        delay: 1000,
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
            events: {
                click: function () {
                    console.log('legend click', arguments)
                }
            }
        },
        events: {
            click: function () {
                console.log('chart click', arguments)
            }
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
            {
                type: 'area', //area or bar or bubble or line or pie
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