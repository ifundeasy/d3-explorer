(function (d3) {
    /**
     * Donut instance
     * @param config : typeof Object
     * @returns {donut}
     */
    var donut = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };

    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    donut.prototype.redraw = function (callback) {
        var me = this, cb;
        var p = {
            parent: me.parent,
            delay: me.delay || 1000,
            fontSize: me.fontSize || 12,
            opacity: me.opacity || 5,
            colors: me.colors || [
                '#FE8400', '#E25669', '#F4D500', '#45AF94', '#5FBCCE',
                '#0085B2', '#BFBFFF', '#886FC9', '#DC73FF', '#73B9FF',
                '#A2BF23', '#FED8AF', '#FAA5BA', '#FFE750', '#4EC5A3',
                '#63C8DE', '#0091C7', '#D6E1FF', '#A785FA', '#FDBBFF',
                '#C0E67C', '#FFB973', '#FF8544', '#FF6154', '#FFC566',
                '#A6CC35', '#2997C1', '#91C3FF', '#A83AA3', '#SC1378'
            ]
        };

        function key(d) {
            if (d.data.color != undefined)return d.data.label + d.data.color;
            return d.data.label;
        }

        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        p.width = $(p.parent).width();
        p.height = $(p.parent).height();

        $(p.parent).html('');

        p.radius = Math.min(p.width, p.height) / 2;
        p.getColor = p.colors.constructor == Array ? d3.scale.category20c().range(p.colors) : d3.scale.category20c();

        if (!$(p.parent).attr('id')) $(p.parent).attr('id', (new Date().getTime()).toString(32));

        p.vid = $(p.parent).attr('id');
        p.node = d3.select(p.parent)
        .append("svg")
        .attr({
            "width": p.width,
            "height": p.height
        })
        .append("g");
        p.node.append("g").attr("class", "slices");
        p.node.append("g").attr("class", "labels");
        p.node.append("g").attr("class", "lines");

        p.pie = d3.layout.pie().sort(null)
        .value(function (d) {
            return d.value;
        });

        p.arc = d3.svg.arc()
        .outerRadius(p.radius * 0.8)
        .innerRadius(p.radius * 0.4);

        p.outerArc = d3.svg.arc()
        .innerRadius(p.radius * 0.9)
        .outerRadius(p.radius * 0.9);

        p.node.attr("transform", "translate(" + p.width / 2 + "," + p.height / 2 + ")");

        p.slice = p.node.select(".slices").selectAll("path.slice")
        .data(p.pie(me.data), key);

        p.slice.enter()
        .insert("path")
        .style("fill", function (d) {
            //return color(d.data.label);
            if (d.data.color != undefined) {
                return d.data.color;
            } else {
                return p.getColor(d.data.label);
            }
        })
        .attr("class", "slice");

        p.slice
        .transition().duration(p.delay)
        .attrTween("d", function (d) {
            //console.log(JSON.stringify(d))
            this._current = {"data": {"label": "", "value": 0}, "value": 0, "startAngle": 0, "endAngle": 0, "padAngle": 0};
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return p.arc(interpolate(t));
            };
        });

        p.slice
        .on('click', function (d, a, b) {
            d3.selectAll(".text-" + p.vid + "-" + d.data.seq)
            .style("opacity", "1");
            d3.selectAll(".polyline-" + p.vid + "-" + d.data.seq)
            .style("opacity", "1");

            return me.events["click"] ? me.events["click"]([d, a, b], me.proto, me) : null;
        })
        .on('contextmenu', function (d, a, b) {
            d3.selectAll(".text-" + p.vid + "-" + d.data.seq)
            .style("opacity", "1");
            d3.selectAll(".polyline-" + p.vid + "-" + d.data.seq)
            .style("opacity", "1");

            return me.events["contextmenu"] ? me.events["contextmenu"]([d, a, b], me.proto, me) : null;
        })
        .on("mouseover", function (d, a, b) {
            d3.selectAll(".text-" + p.vid + "-" + d.data.seq)
            .style("opacity", "1");
            d3.selectAll(".polyline-" + p.vid + "-" + d.data.seq)
            .style("opacity", "1");

            return me.events["mouseover"] ? me.events["mouseover"]([d, a, b], me.proto, me) : null;
        })
        .on("mouseleave", function (d, a, b) {
            d3.selectAll(".text-" + p.vid + "-" + d.data.seq)
            .style("opacity", function (d) {
                if (d.data.value / me.valueSum * 100 < p.opacity) {
                    return "0"
                }
            });
            d3.selectAll(".polyline-" + p.vid + "-" + d.data.seq)
            .style("opacity", function (d) {
                if (d.data.value / me.valueSum * 100 < p.opacity) {
                    return "0"
                }
            });

            return me.events["mouseleave"] ? me.events["mouseleave"]([d, a, b], me.proto, me) : null;
        });

        p.slice.exit().remove();

        p.text = p.node.select(".labels")
        .selectAll("text")
        .data(p.pie(me.data), key);

        p.text.enter()
        .append("text")
        .attr("dy", ".35em")
        .attr("class", function (d) {
            return "text-" + p.vid + "-" + d.data.seq;
        })
        .style("opacity", function (d) {
            if (d.data.value / me.valueSum * 100 < p.opacity) {
                return "0"
            }
        })
        //.style("text-decoration","underline")
        //.style("font-family","arial")
        //.style("font-weight","bold")
        .html(function (d) {
            if (d.data.label.length > 15) {
                var dLabel = "";
                var dYcounter = 0;
                var splittedLabel = d.data.label.split(' ');
                for (i in splittedLabel) {
                    dLabel += '<tspan x="0" y="0" dy="' + dYcounter + 'em">' + splittedLabel[i] + '</tspan>'
                    dYcounter += 0.9;
                }
                return dLabel;
                //return d.data.label.substr(0,12)+'...';
            } else {
                return d.data.label;
            }
        });

        p.text.transition().duration(p.delay)
        .attrTween("transform", function (d) {
            this._current = {"data": {"label": "", "value": 0}, "value": 0, "startAngle": 0, "endAngle": 0, "padAngle": 0};
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = p.outerArc.centroid(d2);
                pos[0] = p.radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        });

        p.text.exit().remove();

        p.polyline = p.node.select(".lines").selectAll("polyline")
        .data(p.pie(me.data), key);

        p.polyline.enter()
        .append("polyline")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .style("fill", "none")
        .style("opacity", function (d) {
            if (d.data.value / me.valueSum * 100 < p.opacity) {
                return "0"
            }
        })
        .attr("class", function (d) {
            return "polyline-" + p.vid + "-" + d.data.seq;
        });

        p.polyline.transition().duration(p.delay)
        .attrTween("points", function (d) {
            this._current = {"data": {"label": "", "value": 0}, "value": 0, "startAngle": 0, "endAngle": 0, "padAngle": 0};
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = p.outerArc.centroid(d2);
                pos[0] = p.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [
                    p.arc.centroid(d2),
                    p.outerArc.centroid(d2),
                    pos
                ];
            };
        });

        p.polyline.exit().remove();

        me.proto = p;
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }
        return cb
    };
    donut.prototype.redrawCompare = donut.prototype.redraw;

    /**
     * Normalize data
     * description : if not set "config.data" at first instance donut class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    donut.prototype.normalize = function (callback) {
        var me = this, cb;

        me.valueSum = 0;
        me.data = me.rows.map(function (row, i) {
            me.valueSum += row[1];
            return ({
                "label": row[0],
                "value": row[1],
                "seq": me.rows.length - i - 1
            })
        });

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }

        return cb
    };
    donut.prototype.normalizeCompare = function (callback) {
        var me = this, cb;

        me.valueSum = 0;
        me.data = me.rows.map(function (row, i) {
            me.valueSum += row[1];
            return ({
                "label": row[0],
                "color": row[2],
                "value": row[1],
                "seq": me.rows.length - i - 1
            })
        });

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }

        return cb
    }

    /**
     * Invoke a d3 class!
     * @param config
     * @returns {donut}
     */
    d3.donut = function (config) {
        return new donut(config)
    };
})(d3);