(function (d3) {
    /**
     * Sunburst instance
     * @param config : typeof Object
     * @returns {sunburst}
     */
    var pie = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    pie.prototype.redraw = function (callback) {
        var me = this, cb;

        me.proto = {};
        me.proto.parent = me.parent;
        me.proto.width = $(me.proto.parent).width();
        me.proto.height = $(me.proto.parent).height();
        me.proto.radius = Math.min(me.proto.width, me.proto.height) / 2 - Math.min(me.proto.width, me.proto.height) / 17;

        $(me.proto.parent).html('');

        me.proto.arc = d3.svg.arc()
        .outerRadius(me.proto.radius)
        .innerRadius(0);

        me.proto.pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.size;
        });

        me.proto.svg = d3.select(me.proto.parent).append("svg")
        .attr("width", me.proto.width)
        .attr("height", me.proto.height)
        .append("g")
        .attr("transform", "translate(" + me.proto.width / 2 + "," + me.proto.height / 2 + ")");

        me.proto.g = me.proto.svg.selectAll(".arc")
        .data(me.proto.pie(me.data))
        .enter().append("g")
        .attr("class", "arc");

        me.proto.path = me.proto.g.append("path")
        .transition().duration(500)
        .attr({
            d: me.proto.arc,
            id: function (d) {
                return "path-" + d.data.id
            },

            opened: 'false',
            transform: null,
            _transform: function (d) {
                return "translate(" + me.proto.arc.centroid(d) + ")";
            },
        })
        .style({
            fill: function (d) {
                return d.data.color;
            },
            stroke: function (d) {
                return d.data.color.darker()
            }
        });

        me.proto.path = me.proto.g.selectAll('path');
        me.proto.total = d3.sum(me.data, function (d, i) {
            return d.size;
        });
        me.proto.text = me.proto.g.append("text")
        .attr({
            id: function (d) {
                return "text-" + d.data.id
            },
            //dy : '.35em',
            transform: function (d) {
                return "translate(" + me.proto.arc.centroid(d).map(function (c) {
                        return c * 1.4
                    }) + ")";
            },
            _transform: function (d) {
                return "translate(" + me.proto.arc.centroid(d).map(function (c) {
                        return c * 1.4
                    }) + ")";
            }
        })
        .style({
            "text-anchor": "middle",
            "font-weight": '200',
            "font-size": "x-small",
            "text-transform": "capitalize"
        })
        .text(function (d) {
            return d.data.text + " ( " + d3.round(d.data.size / me.proto.total * 100, 2) + "% )";
        });

        me.proto.path.on("click", function (d, a, b) {
            var id = d.data.id;
            var except = d3.selectAll(me.proto.parent + " path[id]");
            var path = d3.select(me.proto.parent + " path#path-" + id);
            var text = d3.select(me.proto.parent + " text#text-" + id);
            var centroid = me.proto.arc.centroid(d);

            except.each(function (d, i) {
                var pathExcept = d3.select(me.proto.parent + " path#path-" + d.data.id);
                var textExcept = d3.select(me.proto.parent + " text#text-" + d.data.id);
                if (d.data.id == id) {
                    var opened = path.attr('opened');
                    if (opened == "false") {
                        path.attr('opened', 'true');
                        path.style('opacity', '1');

                        path.transition().duration(200).attr({
                            transform: "translate(" + (centroid[0] / 3) + "," + (centroid[1] / 3) + ")"
                        });
                        text.transition().duration(200).attr({
                            transform: "translate(" + text.attr('_transform').split(',').map(function (arr, i) {
                                return parseFloat(arr.replace('translate(', "").replace(')', "")) + centroid[i] / 4
                            }).toString() + ")"
                        });
                    } else {
                        path.attr('opened', 'false');
                        path.attr('transform', null);
                        text.attr('transform', text.attr('_transform'));
                    }
                } else {
                    pathExcept.attr('transform', null);
                    textExcept.attr('transform', textExcept.attr('_transform'));
                    pathExcept
                    .transition().duration(200).style('opacity', '0.5')
                    .transition().duration(2000).style('opacity', '1')
                }
            });

            if (me.events["click"]) return me.events["click"]([d, a, b], me.proto, me)
        });
        me.proto.path.on("mouseover", function (d, a, b) {
            if (me.events["mouseover"]) return me.events["mouseover"]([d, a, b], me.proto, me)
        });
        me.proto.path.on("mouseleave", function (d, a, b) {
            if (me.events["mouseleave"]) return me.events["mouseleave"]([d, a, b], me.proto, me)
        });
        me.proto.path.on("contextmenu", function (d, a, b) {
            if (me.events["contextmenu"]) return me.events["contextmenu"]([d, a, b], me.proto, me)
        });

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }

        return cb
    };
    pie.prototype.redrawCompare = pie.prototype.redraw;
    //
    pie.prototype.normalize = function (callback) {
        var me = this, cb;
        var //color = d3.scale.category20(),
            color = [
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
        var getRandom = function (range, arg) {
            var ret = Math.random() * range;
            if (!(ret <= arg)) {
                ret = getRandom(range, arg)
            }
            return ret
        };
        me.data = me.rows.map(function (row, i) {
            return {
                id: 'segment-' + i,
                text: row[0],
                size: row[1],
                color: (function () {
                    //var c = row[2] || color(getRandom(100, 20));
                    var c = row[2] || color[i];
                    return d3.rgb(c)
                })()
            }
        });
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }

        return cb
    };
    pie.prototype.normalizeCompare = function (callback) {
        var me = this, cb;
        me.data = me.rows.map(function (row, i) {
            return {
                id: 'segment-' + i,
                text: row[0],
                size: row[1],
                color: d3.rgb(row[3])
            }
        });
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }

        return cb
    };
    /**
     * Invoke a d3 class!
     * @param config
     * @returns {pie}
     */
    d3.pie = function (config) {
        return new pie(config)
    };
})(d3);