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
        var p = {};
        var data = me.data;
        var sorted = p.sorted = me.sort;
        var animation = p.animation = me.animation;
        var showRoot = p.showRoot = me.showRoot;
        var parent = p.parent = me.parent;
        var delay = p.delay = me.delay || 1000;
        var fontSize = p.fontSize = me.fontSize || 12;
        var gradation = p.gradation = me.gradation;
        var width = p.width = $(parent).width();
        var height = p.height = $(parent).height();
        var radius = p.radius = Math.min(width, height) / 2.1;
        var x = p.x = d3.scale.linear().range([0, 2 * Math.PI]);
        var y = p.y = d3.scale.linear().range([0, radius]);
        var colors = p.colors = me.colors || d3.scale.category20c();
        var partition = p.partition = d3.layout.partition().sort(null).value(function (d) {
            return d.size;
        });
        //
        var arc = p.arc = d3.svg.arc()
        .startAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
        })
        .endAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
        })
        .innerRadius(function (d) {
            d.innerRadius = Math.max(0, Math.min(2 * Math.PI, x(d.x)));
            return Math.max(0, y(d.y));
        })
        .outerRadius(function (d) {
            d.outerRadius = Math.max(0, y(d.y + d.dy));
            return Math.max(0, y(d.y + d.dy));
        });
        var sorter = p.sorter = function (value) {
            return value ? (function (d) {
                return d.size;
            }) : (function () {
                return 1;
            })
        };
        var stash = p.stash = function (d) {
            d.x0 = d.x;
            d.dx0 = d.dx;
        };
        var arcTweenData = p.arcTweenData = function (a, i) {
            var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
            var tween = function (t) {
                var b = oi(t);
                a.x0 = b.x;
                a.dx0 = b.dx;
                return arc(b);
            }
            if (i == 0) {
                // If we are on the first arc, adjust the x domain to match the root node
                // at the current zoom level. (We only need to do this once.)
                var xd = d3.interpolate(x.domain(), [data.x, data.x + data.dx]);
                return function (t) {
                    x.domain(xd(t));
                    return tween(t);
                };
            } else {
                return tween;
            }
        };
        var arcTweenZoom = p.arcTweenZoom = function (d) {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function (d, i) {
                return i ? function (t) {
                    return arc(d);
                } : function (t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                    return arc(d);
                };
            };
        };
        var transform = p.transform = function (d) {
            return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
        };
        //
        $(parent).html('');
        //
        var svg = p.svg = d3.select(parent).append("svg");
        var root = p.root = svg.append("g");
        var group = p.group = root.datum(data).selectAll("g").data(partition.nodes).enter().append("g");
        var path = p.path = group.append("path");
        var text = p.text = group.append("text");
        var title = p.title = group.append('title');
        var play = p.play = function (delay, is) {
            text.transition().attr("opacity", 0);
            path
            .data(partition.value(sorter(is)).nodes)
            .transition()
            .duration(delay)
            .attrTween("d", arcTweenData)
            .each("end", function (e, i) {
                var arcText = d3.select(this.parentNode).select("text");
                arcText.transition().duration(delay / 2)
                .attr("opacity", 1)
                .attr("transform", function () {
                    return "rotate(" + transform(e) + ")"
                })
                .attr("x", function (d) {
                    return y(d.y);
                });
            });
        };
        var drilldown = p.drilldown = function (d) {
            text.transition().attr("opacity", 0);
            path.transition()
            .duration(delay)
            .attrTween("d", arcTweenZoom(d))
            .each("end", function (e, i) {
                if (e.x >= d.x && e.x < (d.x + d.dx)) {
                    var arcText = d3.select(this.parentNode).select("text");
                    arcText.transition().duration(delay / 2)
                    .attr("opacity", 1)
                    .attr("transform", function () {
                        return "rotate(" + transform(e) + ")"
                    })
                    .attr("x", function (d) {
                        return y(d.y);
                    });
                }
            });
        }
        //
        svg.attr({width: width, height: height});
        root.attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
        path.attr("d", arc)
        .style({
            "fill": function (d) {
                return colors((d.children ? d : d.parent).name);
            },
            "fill": function (d) {
                if (d.color && d3.rgb(d.color)) {
                    color = d3.rgb(d.color)
                } else if (d.parent && gradation) {
                    if (d.parent.color && d3.rgb(d.parent.color)) {
                        color = d3.rgb(d.parent.color).brighter(0.6)
                    }
                }
                if (gradation) {
                    var z = setInterval(function () {
                        if (d.parent.color) {
                            clearInterval(z);
                            color = d3.rgb(d.parent.color).brighter(gradation)
                        }
                    }, 100)
                }
                d.color = color;
                return d.color
            },
            "fill": function (d) {
                d.color = d.color ? d3.rgb(d.color) : gradation ? d3.rgb(d.parent.color).brighter(gradation) : me.setColor(d.text);
                return d.color
            },
            "opacity": function (d) {
                if (!d.depth) {
                    return showRoot === true ? 0.25 : 0
                }
                return 1;
            },
            //
            "stroke": '#FFFFFF',
            "stroke-width": '2',
            "stroke-opacity": '0.2',
            "fill-rule": 'evenodd',
        })
        .on("click", drilldown)
        .each(stash);
        title.text(function (d) {
            var txt = d.text;
            if (!d.children) txt += ' : ' + d.size;
            //d.size = d.size || d.children.map(function (a) {return a.size}).reduce(function (a, b) {return a + b});
            return txt
        });
        text.attr({
            'x': function (d) {
                return y(d.y);
            },
            'dx': '2',
            'dy': '.35em',
            'transform': function (d) {
                return "rotate(" + transform(d) + ")";
            },
            //
            'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
            'font-size': fontSize,
            'cursor': 'default',
            'fill-rule': 'evenodd'
        })
        .text(function (d) {
            var parent = this.previousSibling;
            var width = parent.getBBox().width;
            return d.text;
        });
        if (sorted !== true) play(0);
        //
        root.selectAll('text, path').attr('oncontextmenu', "return false;")
        root.selectAll('text, path').on('click', function (d, a, b) {
            //Extend this!
            if (me.events["click"]) return me.events["click"]([d, a, b], me.proto, me)
        });
        root.selectAll('text, path').on('mouseover', function (d, a, b) {
            if (me.events["mouseover"]) return me.events["mouseover"]([d, a, b], me.proto, me)
        });
        root.selectAll('text, path').on('mouseleave', function (d, a, b) {
            if (me.events["mouseleave"]) return me.events["mouseleave"]([d, a, b], me.proto, me)
        });
        root.selectAll('text, path').on('contextmenu', function (d, a, b) {
            if (me.events["contextmenu"]) return me.events["contextmenu"]([d, a, b], me.proto, me)
        });
        root.selectAll('text, path').on('dblclick', function (d, a, b) {
            if (me.events["dblclick"]) return me.events["dblclick"]([d, a, b], me.proto, me)
        });
        //
        me.proto = p;
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
        //        me.colors = me.colors || [
        //                '#FE8400', '#E25669', '#F4D500', '#45AF94', '#5FBCCE',
        //                '#0085B2', '#BFBFFF', '#886FC9', '#DC73FF', '#73B9FF',
        //                '#A2BF23', '#FED8AF', '#FAA5BA', '#FFE750', '#4EC5A3',
        //                '#63C8DE', '#0091C7', '#D6E1FF', '#A785FA', '#FDBBFF',
        //                '#C0E67C', '#FFB973', '#FF8544', '#FF6154', '#FFC566',
        //                '#A6CC35', '#2997C1', '#91C3FF', '#A83AA3', '#5C1378'
        //            ];
        me.colors = me.colors || [
                '#F4D500', '#45AF94', '#FE8400', '#E25669', '#5FBCCE',
                '#0085B2', '#BFBFFF', '#886FC9', '#DC73FF', '#73B9FF',
                '#A2BF23', '#FED8AF', '#FAA5BA', '#FFE750', '#4EC5A3',
                '#63C8DE', '#0091C7', '#D6E1FF', '#A785FA', '#FDBBFF',
                '#C0E67C', '#FFB973', '#FF8544', '#FF6154', '#FFC566',
                '#A6CC35', '#2997C1', '#91C3FF', '#A83AA3', '#5C1378'
            ];
        me.setColor = me.colors.constructor == Array ? d3.scale.category20c().range(me.colors) : d3.scale.category20c();
        //
        if (me.preprocess) if (me.preprocess.constructor === Function) me.preprocess(me);
        //
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