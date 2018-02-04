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
            p.svg = d3.select(p.parent).append("svg");
            p.svg.attr({
                "width": p.width,
                "height": p.height,
            });

            p.node = p.svg.append("g");
            p.node
            .attr("transform", "translate(" + [p.width >> 1, p.height >> 1] + ")")
            .selectAll("text").data(words)
            .enter().append("text")
            .text(function (d) {
                //return d.text.toLowerCase();
                return d.text;
            })
            .style({
                "opacity": 0,
                "font-size": function (d) {
                    return ((10 + Math.random() * 90) + "px");
                },
                "fill": function (d, i) {
                    return d.color ? d.color : p.color(Math.round(d3.scale.log()(d3.scale.sqrt()(Math.random())) * -20));
                }
            })
            .attr("transform", function (d, i) {
                var r = Math.random() * d3.scale.log()(d3.scale.sqrt()(i + 1)) * 20;
                return "translate(" + [d.x, d.y] + ")rotate(" + r + ")";
            })
            .transition()
            .duration(parseFloat(p.delay))
            .style({
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
            .attr({
                "id": function (d) {
                    return d.id;
                },
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
            });
            p.node.append('text').attr({
                'id': p.id + '-wc-span',
                'transform': 'translate(0,30)rotate(0)',
                'text-anchor': "middle"
            }).style({
                'font-family': 'Menlo',
                'font-size': '12px',
                'display': 'none',
                'opacity': 1
            });

            p.text = p.svg.selectAll('text');

            d3.selectAll('body, ' + me.parent + ', ' + me.parent + '>svg').on('click__', function () {
                var text = d3.selectAll('#' + p.id + ' text[_transform]');
                var spanner = d3.select('#' + p.id + '-wc-span');

                spanner.transition().duration(3000).style('display', 'none');
                text.transition().duration(1000)
                .style({
                    "opacity": 1,
                    "font-size": function (d) {
                        return d.size + "px";
                    }
                })
                .attr("transform", function (d) {
                    var translate = d3.select('#' + d.id);
                    return translate.attr('_transform')
                });
            });
            p.text.on('click__', function (d, a, b) {
                var text = d3.selectAll('#' + p.id + ' text[_transform]');
                var clicked = d3.select('#' + d.id);
                var spanner = d3.select('#' + p.id + '-wc-span');
                /*
                spanner.transition().duration(750)
                    .text(function () {
                        var data = {
                            "text"     : d.text,
                            "data"     : d.data,
                            "font-size": d.size,
                            "font-log" : Math.floor(d.log * 100) / 100,
                            "id"       : d.id
                        };
                        return JSON.stringify(data, undefined, 4)
                    })
                    .style({
                        fill   : clicked.style('fill'),
                        display: 'block',
                    });
                */
                spanner.transition().duration(750)
                .text(function () {
                    var data = {
                        "count": d.data
                    };
                    return JSON.stringify(data, undefined, 4)
                })
                .style({
                    fill: clicked.style('fill'),
                    display: 'block'
                });
                text.transition().duration(1500)
                .attr({
                    clicked: 'false',
                    transform: function (d) {
                        var translate = d3.select('#' + d.id);
                        return translate.attr('_transform')
                    },
                })
                .style({
                    "opacity": 0.03,
                    "font-size": function (d) {
                        return d.size + "px";
                    }
                });
                clicked.transition().duration(750)
                .attr({
                    clicked: 'true',
                    transform: function (d) {
                        return "translate(" + [0, 0] + ")rotate(" + 0 + ")";
                    },
                })
                .style({
                    "opacity": 1,
                    "font-size": function (d) {
                        return (p.maxFontSize) + "px";
                    }
                });

                d3.event.stopPropagation();
                //
                d3.selectAll('.d3-context-menu').style('display', 'none');
                //

                if (clicked.attr('clicked') == 'true') {
                    if (me.events["click"]) {
                        me.events["click"]([d, a, b], me.proto, me)
                    }
                }
            });
            p.text.on('click', function (d, a, b) {
                d3.event.stopPropagation();

                //Extend this!
                if (me.events["click"]) return me.events["click"]([d, a, b], me.proto, me)
            });
            p.text.on('mouseover', function (d, a, b) {
                d3.event.stopPropagation();

                //Extend this!
                if (me.events["mouseover"]) return me.events["mouseover"]([d, a, b], me.proto, me)
            });
            p.text.on('mouseleave', function (d, a, b) {
                d3.event.stopPropagation();

                //Extend this!
                if (me.events["mouseleave"]) return me.events["mouseleave"]([d, a, b], me.proto, me)
            });
            p.text.on('contextmenu', function (d, a, b) {
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