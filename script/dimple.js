(function (d3) {
    var d = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };
    //
    d.prototype.redraw = function (callback) {
        var me = this, cb;
        //console.log(me.data)
        var colors = [
            /*
            '#E25669', //merah
            '#F4D500', //kuning
            '#45AF94', //hijau
            */
            '#E25669', '#F4D500', '#45AF94', '#FE8400', '#5FBCCE',
            '#0085B2', '#BFBFFF', '#886FC9', '#DC73FF', '#73B9FF',
            '#A2BF23', '#FED8AF', '#FAA5BA', '#FFE750', '#4EC5A3',
            '#63C8DE', '#0091C7', '#D6E1FF', '#A785FA', '#FDBBFF',
            '#C0E67C', '#FFB973', '#FF8544', '#FF6154', '#FFC566',
            '#A6CC35', '#2997C1', '#91C3FF', '#A83AA3', '#SC1378'
        ];
        var p = {
            parent: me.parent || '',
            ease: me.ease || 'bounds',
            delay: me.delay || 500,
            gridline: me.gridline || {},
            bound: me.bound || {},
            legend: me.legend || {},
            //colors: me.colors || [],
            series: me.series || [],
            axes: me.axes || []
        };

        p.legend.events = p.legend.events || {};
        p.height = $(p.parent).height();
        p.width = $(p.parent).width();

        $(p.parent).html('');

        p.svg = dimple.newSvg(p.parent, p.width, p.height);
        p.chart = new dimple.chart(p.svg, me.data);

        /* set bounds */
        p.bound.xCoor = p.bound.xCoor || 50;
        p.bound.yCoor = p.bound.yCoor || 50;
        p.chart.setBounds(
            (p.bound.xCoor),
            (p.bound.yCoor),
            (p.bound.width || (p.width - (p.bound.xCoor) - 1)),
            (p.bound.height || (p.height - (p.bound.yCoor * 2)))
        );

        if ((p.axes.constructor == Array) && (p.axes.length)) {
            p.axes.forEach(function (ax, i) {
                if ((ax.constructor == Object) && (Object.keys(ax).length)) {
                    var method = undefined;
                    ax.type = ax.type || 'measure';
                    ax.axis = ['x', 'y'].indexOf(ax.axis) == -1 ? 'x' : ax.axis;
                    switch (ax.type) {//category or measure or pct or color or log
                        case "category" :
                            method = 'addCategoryAxis';
                            break;
                        //case "pct" : method = 'addPctAxis'; break; //todo : next time!
                        //case "color" : method = 'addColorAxis'; break; //todo : next time!
                        //case "log" : method = 'addLogAxis'; break; //todo : next time!
                        default :
                            method = 'addMeasureAxis';
                            break;
                    }

                    p.axes[i] = p.chart[method](ax.axis, ax.key);

                    if (ax.hidden && (ax.hidden == true)) p.axes[i].hidden = true;
                    if (ax.order) p.axes[i].addOrderRule(ax.order);
                }
            });
        }

        if ((p.series.constructor == Array) && (p.series.length)) {
            p.series.forEach(function (sr, i) {
                //todo : hack color start
                var entities = [];

                me.data.forEach(function (o) {
                    if (entities.indexOf(o[sr.key]) === -1) {
                        entities.push(o[sr.key]);
                        if (o.color) {
                            p.chart.assignColor(o[sr.key], o.color);
                        }
                        else {
                            //color sort by data
                            p.chart.assignColor(o[sr.key], colors[(entities.length - 1)]);
                        }
                    }
                });

                /*entities.forEach(function(en, u){
                    p.chart.assignColor(en, colors[u]);
                });*/
                //todo : hack color end

                if ((sr.constructor == Object) && (Object.keys(sr).length)) {
                    sr.type = sr.type || '';
                    p.series[i] = p.chart.addSeries(sr.key, dimple.plot[sr.type]);
                    p.series[i].addEventHandler("click", function (el) {
                        return me.events["click"] ? me.events["click"](el, p, me) : null;
                    });
                    if (sr.radius) p.series[i].interpolation = sr.radius;

                    p.chart.assignColor(p.series[i], 'red');
                }
            });
        }

        /*
        if ((p.colors.constructor == Array) && (p.colors.length)) {
            p.colors.forEach(function (cl, i) {
                p.chart.assignColor(cl, 'red');
                if ((cl.constructor == Object) && (Object.keys(cl).length)) {
                    if (cl.color && cl.key) {
                        p.chart.assignColor(cl.key, cl.color);
                    }
                }
            });
        }
        */

        if ((p.legend.constructor == Object) && (Object.keys(p.legend).length)) {
            p.legend.xCoor = p.legend.xCoor || 0;
            p.legend.yCoor = p.legend.yCoor || 0;
            p.legend.proto = p.chart.addLegend(
                (p.legend.xCoor),
                (p.legend.yCoor + 1),
                (p.legend.width || p.width),
                (p.legend.height || p.height),
                (p.legend.align || 'left')
            );
        }

        p.chart.ease = p.ease;
        p.chart.draw(p.delay);

        me.proto = p;

        d3.selectAll('.dimple-legend').style('cursor', 'pointer');
        p.legend.proto.shapes.selectAll("rect")
        .on("click", function (d, a, b) {
            if (p.legend.events && p.legend.events["click"]) {
                return p.legend.events["click"]([d, a, b], p, me); //el, proto, chart
            }
        });
        //todo : grid line, line width chart, etc.

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }

        return cb
    };
    d.prototype.redrawCompare = d.prototype.redraw;
    //
    d.prototype.normalize = function (callback) {
        var me = this, cb;

        me.data = me.rows.map(function (row, i) {
            var obj = {};
            me.fields.forEach(function (field, j) {
                obj[field] = row[j];
            });
            return obj
        });

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }

        return cb
    };
    d.prototype.normalizeCompare = d.prototype.normalize;
    //
    d3.dimple = function (config) {
        return new d(config)
    };
})(d3);