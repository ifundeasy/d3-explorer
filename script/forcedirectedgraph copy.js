(function (d3) {
    /**
     * Sunburst instance
     * @param config : typeof Object
     * @returns {sunburst}
     */
    var forcedirect = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };

    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    forcedirect.prototype.redraw = function (callback) {
        var me = this, cb;
        me.proto = {};

        me.proto.parent = me.parent;
        me.proto.width = $(me.proto.parent).width();
        me.proto.height = $(me.proto.parent).height();
        me.proto.charge = -1 * (me.proto.height >= me.proto.width ? me.proto.width : me.proto.height) / 4;
        me.proto.lineDistance = me.lineDistance || 50;
        me.proto.bulletSize = me.bulletSize || 5;
        me.proto.maxLineWidth = me.maxLineWidth >= me.bulletSize ? me.bulletSize : me.maxLineWidth;

        $(me.proto.parent).html('');

        me.proto.domainVal = me.data.links.map(function (arr) {
            return parseFloat(arr.value)
        });
        me.proto.rangeVal = [1, me.proto.maxLineWidth];
        me.proto.color = d3.scale.category20();
        me.proto.scale = d3.scale.quantile()
        .domain(me.proto.domainVal)
        .range(me.proto.rangeVal);

        //for focused feature *********************************************************************************************
        var tocolor = "fill";
        var towhite = "stroke";
        var default_link_color = "#888";
        var focus_node = null;
        var highlight_node = null;
        var highlight_trans = 0.1;
        var highlight_trans_fixed = 0.001;
        var linkedByIndex = {};
        var highlight_color = "#888";
        var isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        var isConnected = function (a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        };
        var exit_highlight = function () {
            highlight_node = null;
            if (focus_node === null) {
                me.proto.svg.style("cursor", "move");
                if (highlight_color != "white") {
                    me.proto.circle.style(towhite, "white");
                    me.proto.text.style("font-weight", "normal");
                    me.proto.link.style("stroke", function (o) {
                        return (isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color
                    });
                }

            }
        }
        var set_highlight = function (d) {
            me.proto.svg.style("cursor", "pointer");
            if (focus_node !== null) d = focus_node;
            highlight_node = d;

            if (highlight_color != "white") {
                me.proto.circle.style(towhite, function (o) {
                    return isConnected(d, o) ? highlight_color : "white";
                });
                me.proto.text.style("font-weight", function (o) {
                    return isConnected(d, o) ? "bold" : "normal";
                });
                me.proto.link.style("stroke", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color);

                });
            }
        };
        var set_focus = function (d) {
            if (highlight_trans < 1) {
                me.proto.circle.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });
                me.proto.text.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });
                me.proto.link.style("opacity", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
                });
            }

            me.proto.circle.style("opacity", function (o) {
                return isConnected(d, o) ? 1 : highlight_trans_fixed;
            });
        };
        var mouseleaveevent = function () {
            if (focus_node !== null) {
                focus_node = null;
                if (highlight_trans < 1) {
                    me.proto.circle.style("opacity", 1);
                    me.proto.text.style("opacity", 1);
                    me.proto.link.style("opacity", 1);
                }
            }
            //if (highlight_node === null) exit_highlight();
        };
        var mouseoverevent = function (d, a, b) {
            d3.event.stopPropagation();
            focus_node = d;
            set_focus(d);
            //if (highlight_node === null) set_highlight(d)
        };

        me.data.links.forEach(function (link, i) {
            linkedByIndex[link.source + "," + link.target] = true;
        });
        //*****************************************************************************************************************

        me.proto.styles = {
            node: {
                'stroke': function (d) {
                    return d.color ? d.color : (d3.rgb(me.proto.color(d.group)).darker(0.1))
                },
                'stroke-width': '2px',
                'stroke-opacity': '.6',
                'opacity': '.5',
                "fill": function (d) {
                    return d.color ? d.color : me.proto.color(d.group);
                }
            },
            link: {
                'stroke': '#999',
                'stroke-opacity': '.6',
                "stroke-width": function (d) {
                    //console.log(d.value, me.proto.scale(d.value));
                    return me.proto.scale(d.value);
                }
            }
        };

        me.proto.force = d3.layout.force()
        .charge(me.proto.charge)
        .linkDistance(me.proto.lineDistance)
        .size([me.proto.width, me.proto.height]);

        me.proto.svg = d3.select(me.proto.parent).append("svg")
        .attr("width", me.proto.width)
        .attr("height", me.proto.height);

        me.proto.force
        .nodes(me.data.nodes)
        .links(me.data.links)
        .start();

        me.proto.link = me.proto.svg.selectAll(".link")
        .data(me.data.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("val", function (d) {
            return d.value
        })
        .style(me.proto.styles.link);

        me.proto.node = me.proto.svg.selectAll('g').data(me.data.nodes).enter().append('g');
        me.proto.text = me.proto.node.selectAll('text').data(me.data.nodes).enter().append('text');
        me.proto.circle = me.proto.node.selectAll('circle').data(me.data.nodes).enter().append('circle');
        me.proto.circle.attr({
            id: function (d) {
                return 'fd-circle-' + d.name
            },
            class: 'node',
            //r : me.proto.bulletSize
            r: function (d) {
                return d.weight >= me.proto.bulletSize ? d.weight : me.proto.bulletSize;
            }
        }).style(me.proto.styles.node);

        me.proto.text = me.proto.svg.selectAll(".text")
        .data(me.data.nodes).enter().append('text')
        .attr({
            id: function (d) {
                return 'fd-text-' + d.name
            },
            "x": function (d) {
                return d.x
            },
            "y": function (d) {
                return d.y
            }
        })
        .style('font-size', 'smaller')
        //.text(function(d){ return d.name.toString() });
        .text(function (d) {
            return d.name
        });
        me.proto.circle
        .on("dblclick", function (d) {
            d3.select(this).classed("fixed", d.fixed = false);
        })
        .call(me.proto.force.drag().on("dragstart", function (d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }));

        /*
        me.proto.node.append("text").text(function(d) {
            return d.name;
        });
        */

        me.proto.force.on("tick", function () {
            me.proto.link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

            me.proto.circle
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
            me.proto.text
            .attr("x", function (d) {
                return d.x + 5 + me.proto.bulletSize;
            })
            .attr("y", function (d) {
                return d.y + 5 + me.proto.bulletSize;
            });
        });

        /* todo : what the hell, this loop for event attachment doesn't work!
        for(var e in me.events) {
            me.proto.node.on(e, function(d, a, b){
                console.log(e, arguments)
            })
        }
        */

        me.proto.node.on('click', function (d, a, b) {
            if (me.events["click"]) return me.events["click"]([d, a, b], me.proto, me)
        });
        me.proto.node.on('contextmenu', function (d, a, b) {
            if (me.events["contextmenu"]) return me.events["contextmenu"]([d, a, b], me.proto, me)
        });
        me.proto.circle.on('mouseover', function (d, a, b) {
            mouseoverevent(d);
            if (me.events["mouseover"]) return me.events["mouseover"]([d, a, b], me.proto, me)
        });
        me.proto.circle.on("mouseleave", function (d, a, b) {
            mouseleaveevent(d);
            if (me.events["mouseleave"]) return me.events["mouseleave"]([d, a, b], me.proto, me)
        });

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }

        return cb
    };
    forcedirect.prototype.redrawCompare = forcedirect.prototype.redraw;

    /**
     * Normalize data
     * description : if not set "config.data" at first instance forcedirect class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    forcedirect.prototype.normalize = function (callback) {
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
            return val;
        };
        var setUnique = function (array, idx) {
            var ret = [];
            array.forEach(function (arr, i) {
                idx.forEach(function (id) {
                    if ((ret.indexOf(arr[id]) === -1)) {
                        ret.push(validate(arr[id]))
                    }
                })
            });
            return ret;
        };
        var getRandom = function (range, arg) {
            var ret = Math.random() * range;
            if (!(ret <= arg)) {
                ret = getRandom(range, arg)
            }
            return ret
        };

        var collections = setUnique(me.rows, [0, 1]).sort();
        var sources = setUnique(me.rows, [0]).sort();
        var links = setUnique(me.rows, [1]).sort(); //useless!

        me.data = {
            nodes: collections.map(function (source) {
                return ({
                    "name": source,
                    "group": Math.round(getRandom(100, 20))
                })
            }),
            links: me.rows.map(function (row) {
                return ({
                    "source": collections.indexOf(validate(row[0])),
                    "target": collections.indexOf(validate(row[1])),
                    "value": validate(row[2])
                })
            })
        };

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }

        return cb
    };
    forcedirect.prototype.normalizeCompare = function (callback) {
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
            return val;
        };
        var setUnique = function (array, idx) {
            var ret = [];
            array.forEach(function (arr, i) {
                idx.forEach(function (id) {
                    if ((ret.indexOf(arr[id]) === -1)) {
                        ret.push(validate(arr[id]))
                    }
                })
            });
            return ret;
        };
        var getColors = function (val) {
            var retVal = '';
            for (var i = 0; i < me.rows.length; i++) {
                if (me.rows[i][0] == val || me.rows[i][1] == val) {
                    retVal = me.rows[i][2];
                    break;
                }
            }
            return retVal;
        }

        var collections = setUnique(me.rows, [0, 1]).sort();
        //var sources = setUnique(me.rows, [0]).sort();
        //var links = setUnique(me.rows, [1]).sort(); //useless!
        //console.log(me.rows)
        me.data = {
            nodes: collections.map(function (source) {
                //console.log(source)
                return ({
                    "name": source,
                    "color": getColors(source)
                })
            }),
            links: me.rows.map(function (row) {
                //console.log(row)
                return ({
                    "source": collections.indexOf(validate(row[0])),
                    "target": collections.indexOf(validate(row[1])),
                    "value": validate(row[3])
                })
            })
        };
        //console.log(me.data.nodes)

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
     * @returns {forcedirect}
     */
    d3.forcedirect = function (config) {
        return new forcedirect(config)
    };
})(d3);