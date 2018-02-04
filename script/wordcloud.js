(function (d3) {
    /**
     * Sunburst instance
     * @param config : typeof Object
     * @returns {sunburst}
     */
    var wordcloud = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    wordcloud.prototype.redraw = function (callback) {
        var me = this, cb;
        var p = {};
        p.parent = me.parent;
        p.id = $(p.parent).attr('id');
        me.data = me.rows.map(function (row, i) {
            return {
                id: (p.id) + "-wc-" + i, //row[0].replace(/[^a-zA-Z0-9]/g, ''),
                text: row[0],
                data: row[1],
                size: row[1],
                color: row[2],
                log: d3.scale.log()(parseFloat(row[1]))
            }
        });
        p.width = $(p.parent).width();
        p.height = $(p.parent).height();
        p.fontFamily = me.fontFamily || 'Impact';
        p.spiral = me.spiral || 'rectangular';
        p.rotate = (me.rotate || 90).toString();
        p.delay = (me.delay || 5000).toString();
        p.minFontSize = (me.minFontSize || 20).toString();
        p.maxFontSize = (me.maxFontSize || 100).toString();
        p.color = d3.scale.category20();
        //
        $(p.parent).html('');
        //
        p.domainVal = me.rows.map(function (row) {
            return d3.scale.log()(parseFloat(row[1]))
        }).sort(d3.ascending);
        p.rangeVal = [parseFloat(p.minFontSize), parseFloat(p.maxFontSize)];
        p.scale = d3.scale.ordinal()
        .domain(p.domainVal)
        .rangePoints(p.rangeVal);
        p.draw = function (words, bounds) {
            var svg = p.svg = d3.select(p.parent).append("svg");
            var container = p.container = svg.append('g');
            var node = p.node = container.selectAll('.node').data(words).enter().append("g");
            var text = p.text = node.append("text");
            var title = p.title = node.append('title');

            svg.attr({
                "width": p.width,
                "height": p.height,
            });
            container.attr("transform", "translate(" + [p.width >> 1, p.height >> 1] + ")");
            node.attr({
                "id": function (d) {
                    return d.id;
                }
            })
            title.text(function (d) {
                return [d.text, d.size].join(' : ');
            })
            text.text(function (d) {
                return d.text;
            })
            text.attr("transform", function (d, i) {
                var r = Math.random() * d3.scale.log()(d3.scale.sqrt()(i + 1)) * 20;
                return "translate(" + [d.x, d.y] + ") rotate(" + r + ")";
            })
            text.style({
                "opacity": 0,
                "font-size": function (d) {
                    return ((10 + Math.random() * 90) + "px");
                },
                "fill": function (d, i) {
                    return d.color ? d.color : p.color(Math.round(d3.scale.log()(d3.scale.sqrt()(Math.random())) * -20));
                }
            })
            text.transition().duration(parseFloat(p.delay))
            text.style({
                "cursor": 'pointer',
                "font-family": p.fontFamily,
                "opacity": 1,
                "font-size": function (d) {
                    return d.size + "px";
                },
                "fill": function (d, i) {
                    return d.color ? d.color : p.color(i);
                }
            })
            text.attr({
                "text-anchor": 'middle',
                "transform": function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                },
                "_transform": function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                },
                "_font": function (d) {
                    return d.size;
                }
            })
            text.on('click', function (d, a, b) {
                d3.event.stopPropagation();

                //Extend this!
                if (me.events["click"]) return me.events["click"]([d, a, b], me.proto, me)
            });
            text.on('mouseover', function (d, a, b) {
                d3.event.stopPropagation();

                //Extend this!
                if (me.events["mouseover"]) return me.events["mouseover"]([d, a, b], me.proto, me)
            });
            text.on('mouseleave', function (d, a, b) {
                d3.event.stopPropagation();

                //Extend this!
                if (me.events["mouseleave"]) return me.events["mouseleave"]([d, a, b], me.proto, me)
            });
            text.on('contextmenu', function (d, a, b) {
                d3.event.stopPropagation();

                //Extend this!
                if (me.events["contextmenu"]) return me.events["contextmenu"]([d, a, b], me.proto, me)
            });
        };
        p.cloud = d3.layout.cloud()
        .size([p.width, p.height])
        .words(me.data)
        .padding(0)
        .rotate(function () {
            return ~~(Math.random() * 2) * p.rotate;
        })
        .font(p.fontFamily)
        .fontSize(function (d) {
            return Math.round(p.scale(d.log))
        })
        .on("end", p.draw)
        .spiral(p.spiral)
        .start();
        me.proto = p;
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }
        return cb
    };
    wordcloud.prototype.redrawCompare = wordcloud.prototype.redraw;
    //
    wordcloud.prototype.normalize = function (callback) {
        var me = this, cb;
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }
        return cb
    };
    wordcloud.prototype.normalizeCompare = wordcloud.prototype.normalize;
    /**
     * Invoke a d3 class!
     * @param config
     * @returns {wordcloud}
     */
    d3.wordcloud = function (config) {
        return new wordcloud(config)
    };
})(d3);