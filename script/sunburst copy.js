(function (d3) {
    /**
     * Sunburst instance
     * @param config : typeof Object
     * @returns {sunburst}
     */
    var sunburst = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    sunburst.prototype.redraw = function (callback) {
        var me = this, cb;
        me.proto = {};

        me.proto.parent = me.parent;
        me.proto.delay = me.delay || 1000;
        me.proto.fontSize = me.fontSize || 12;
        me.proto.gradation = me.gradation;
        me.proto.width = $(me.proto.parent).width();
        me.proto.height = $(me.proto.parent).height();

        $(me.proto.parent).html('');

        me.proto.radius = Math.min(me.proto.width, me.proto.height) / 2;
        me.proto.colors = me.colors;
        me.proto.x = d3.scale.linear().range([0, 2 * Math.PI]);
        me.proto.y = d3.scale.linear().range([0, me.proto.radius]);

        me.proto.svg = d3.select(me.proto.parent).append("svg")
        .attr({
            "width": me.proto.width,
            "height": me.proto.height
        })
        .append("g")
        .attr("transform", "translate(" + me.proto.width / 2 + "," + (me.proto.height / 2) + ")");

        me.proto.partition = d3.layout.partition()
        .value(function (d) {
            return d.size;
        });

        me.proto.arc = d3.svg.arc()
        .startAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, me.proto.x(d.x)));
        })
        .endAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, me.proto.x(d.x + d.dx)));
        })
        .innerRadius(function (d) {
            return Math.max(0, me.proto.y(d.y));
        })
        .outerRadius(function (d) {
            return Math.max(0, me.proto.y(d.y + d.dy));
        });

        me.proto.g = me.proto.svg.selectAll("g")
        .data(me.proto.partition.nodes(me.data))
        .enter().append("g");

        me.proto.path = me.proto.g.append("path")
        .attr({
            "d": me.proto.arc,
            "stroke": '#FFFFFF',
            "fill-rule": 'evenodd',
            "fill": function (d, i) {
                d.color = d.color ? d3.rgb(d.color) : me.proto.gradation ? d3.rgb(d.parent.color).brighter(me.proto.gradation) : me.setColor(d.text);
                /*
                if (d.color && d3.rgb(d.color)) {
                    color = d3.rgb(d.color)
                } else if (d.parent && me.proto.gradation) {
                    if (d.parent.color && d3.rgb(d.parent.color)) {
                        color = d3.rgb(d.parent.color).brighter(0.6)
                    }
                }
                */
                if (me.proto.gradation) {
                    /*var z = setInterval(function(){
                        if (d.parent.color) {
                            clearInterval(z);
                            color = d3.rgb(d.parent.color).brighter(me.proto.gradation)
                        }
                    }, 100)*/
                }
                //d.color = color;
                return d.color
            },
            "display": function (d) {
                return d.depth ? null : "none";
            }
        });

        me.proto.transform = function (d) {
            return (me.proto.x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180
        };

        me.proto.text = me.proto.g.append("text")
        .attr({
            //'font-family': 'Arial, sans-serif',
            'font-size': me.proto.fontSize,
            'cursor': 'default',
            'fill-rule': 'evenodd',
            'transform': function (d) {
                return "rotate(" + me.proto.transform(d) + ")";
            },
            'x': function (d) {
                return me.proto.y(d.y);
            },
            'dx': '6',
            'dy': '.35em',
        })
        .text(function (d) {
            return d.text;
        });

        // Interpolate the scales!
        me.proto.archTween = function (d) {
            var xd = d3.interpolate(me.proto.x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(me.proto.y.domain(), [d.y, 1]),
                yr = d3.interpolate(me.proto.y.range(), [d.y ? 20 : 0, me.proto.radius]);
            return function (d, i) {
                return i
                    ? function (t) {
                        return me.proto.arc(d);
                    }
                    : function (t) {
                        me.proto.x.domain(xd(t));
                        me.proto.y.domain(yd(t)).range(yr(t));
                        return me.proto.arc(d);
                    };
            };
        };
        /*
        //todo : what the hell, this loop for event attachment doesn't work!
        for (var e in me.events) {
            d3.selectAll('text, path').on(e, function (d, a, b) {
                console.log(e, arguments)
            })
        }
        */
        d3.selectAll('text, path').on('click', function (d, a, b) {
            //note : open this for drilling-down your sunburst!
            me.proto.text.transition().attr("opacity", 0);
            //note : doing drilling up/down
            me.proto.path.transition()
            .duration(me.proto.delay)
            .attrTween("d", me.proto.archTween(d))
            .each("end", function (e, i) {
                // check if the animated element's data e lies within the visible angle span given in d
                if (e.x >= d.x && e.x < (d.x + d.dx)) {
                    // get a selection of the associated text element
                    me.proto.arcText = d3.select(this.parentNode).select("text");
                    // fade in the text element and recalculate positions
                    me.proto.arcText.transition().duration(750)
                    .attr("opacity", 1)
                    .attr("transform", function (d) {
                        return "rotate(" + me.proto.transform(d) + ")";
                    })
                    .attr("x", function (d) {
                        return me.proto.y(d.y);
                    });
                }
            });

            //Extend this!
            if (me.events["click"]) return me.events["click"]([d, a, b], me.proto, me)
        });

        d3.selectAll('text, path').on('mouseover', function (d, a, b) {
            if (me.events["mouseover"]) return me.events["mouseover"]([d, a, b], me.proto, me)
        });

        d3.selectAll('text, path').on('mouseleave', function (d, a, b) {
            if (me.events["mouseleave"]) return me.events["mouseleave"]([d, a, b], me.proto, me)
        });

        d3.selectAll('text, path').on('contextmenu', function (d, a, b) {
            if (me.events["contextmenu"]) return me.events["contextmenu"]([d, a, b], me.proto, me)
        });

        d3.select(self.frameElement).style("height", me.proto.height + "px");

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }

        return cb
    };
    /**
     * Normalize data
     * description : if not set "config.data" at first instance sunburst class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    sunburst.prototype.normalize = function (callback) {
        var me = this, cb;
        var validate = function (val) {
            if (
                (val === undefined) ||
                (val === null) ||
                (val === false) ||
                (val === true) ||
                (val === '') ||
                (val.toString().replace(/\s{2,}/g, ' ') === ' ')
            ) val = 0;
            //return typeof val == 'string' ? val.toLowerCase() : val;
            return val;
        };
        var fn = function (fields, rows, order, val) {
            fn.PARENTS = new Object();
            fn.FIELDS = fields;
            fn.ROWS = rows.map(function (row) {
                var ret = order.map(function (el, i) {
                    return validate(row[el]);
                });
                ret.push(row[val]);
                return ret;
            });
            for (var i = 0; i < order.length - 1; i++) {
                var o = order[i];
                fn.PARENTS[o] = [];
                rows.forEach(function (row) {
                    var d = validate(row[o]);
                    if (fn.PARENTS[o].indexOf(d) == -1) fn.PARENTS[o].push(d);
                });
            }

            fn.result = {
                text: '',
                color: me.setColor(),
                children: fn.PARENTS[order[0]].map(function (el) {
                    return {
                        text: el,
                        children: [],
                        color: me.setColor(el)
                    }
                })
            };
            fn.crawl = function (obj, i) {
                var j = i + 1;
                var currIdx = order[i];
                var nextIdx = order[j];

                obj.children.forEach(function (el) {
                    var children = [],
                        found = fn.ROWS.filter(function (row) {
                            return row[currIdx] == el.text
                        });

                    found.forEach(function (el) {
                        var d = el[nextIdx];
                        if (children.indexOf(d) == -1) children.push(d);
                    });

                    el.key = fn.FIELDS[currIdx];
                    el.children = [];
                    children.forEach(function (text) {
                        el.children.push({text: text, children: []})
                    });

                    if (nextIdx) fn.crawl(el, j);
                    else {
                        delete el.children;
                        el.size = fn.ROWS.filter(function (row) {
                            return row[currIdx] == el.text
                        })[0][val];
                    }
                });
                return obj;
            };

            return fn.crawl(fn.result, 0);
        };

        /*me.colors = me.colors || [
            '#FE8400', '#E25669', '#F4D500', '#45AF94', '#5FBCCE',
            '#0085B2', '#BFBFFF', '#886FC9', '#DC73FF', '#73B9FF',
            '#A2BF23', '#FED8AF', '#FAA5BA', '#FFE750', '#4EC5A3',
            '#63C8DE', '#0091C7', '#D6E1FF', '#A785FA', '#FDBBFF',
            '#C0E67C', '#FFB973', '#FF8544', '#FF6154', '#FFC566',
            '#A6CC35', '#2997C1', '#91C3FF', '#A83AA3', '#5C1378'
        ];*/
        me.colors = me.colors || [
                '#F4D500', '#45AF94', '#FE8400', '#E25669', '#5FBCCE',
                '#0085B2', '#BFBFFF', '#886FC9', '#DC73FF', '#73B9FF',
                '#A2BF23', '#FED8AF', '#FAA5BA', '#FFE750', '#4EC5A3',
                '#63C8DE', '#0091C7', '#D6E1FF', '#A785FA', '#FDBBFF',
                '#C0E67C', '#FFB973', '#FF8544', '#FF6154', '#FFC566',
                '#A6CC35', '#2997C1', '#91C3FF', '#A83AA3', '#5C1378'
            ];
        me.setColor = me.colors.constructor == Array ? d3.scale.category20c().range(me.colors) : d3.scale.category20c();
        me.data = fn(me.fields, me.rows, [0, 1, 2], 3);
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
     * @returns {sunburst}
     */
    d3.sunburst = function (config) {
        return new sunburst(config)
    };
})(d3);
