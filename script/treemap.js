(function (d3) {
    /**
     * Treemap instance
     * @param config : typeof Object
     * @returns {treemap}
     */
    var treemap = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    treemap.prototype.redraw = function (callback) {
        var me = this, cb;
        var p = {
            prefix: 'tm-' + (new Date().getTime()).toString(36),
            parent: me.parent,
            delay: me.delay || 1000,
            fontSize: me.fontSize || 12,
            padding: me.padding || 0,
            opacity: me.opacity || 5,
            margin: {top: 0, right: 0, bottom: 0, left: 0},
            colors: me.colors || [
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
            ]
        };
        p.width = $(p.parent).width();
        p.height = $(p.parent).height();
        p.getColor = p.colors.constructor == Array ? d3.scale.category20c().range(p.colors) : d3.scale.category20c();
        $(p.parent).html('');
        if (!$(p.parent).attr('id')) $(p.parent).attr('id', (new Date().getTime()).toString(32));
        p.vid = $(p.parent).attr('id');
        p.treemap = d3.layout.treemap()
        //.size([(w - (me.margin.left + me.margin.right)),(h - (me.margin.bottom + me.margin.top))])
        .size([p.width, p.height])
        .sticky(true)
        .value(function (d) {
            return d.value;
        });
        p.div = d3.select('#' + p.vid).append("div").attr('class', 'treemap')
        //.style("width", me.width + "px")
        //.style("height", me.height + "px")
        //.style("left", me.margin.left + "px")
        //.style("top", me.margin.top + "px")
        .style("position", "relative");
        p.node = p.div.datum(me.data).selectAll('.' + p.prefix)
        .data(p.treemap.nodes)
        .enter();
        p.block = p.node.append("div")
        .attr("class", '.' + p.prefix)
        .attr("id", function (s) {
            return p.prefix + '-' + Math.floor((Math.random() * 100000000) + 1);
        })
        .style({
            'border': p.padding + 'px solid rgba(255,255,255,0.3)',
            'font-size': '10px',
            'line-height': '12px',
            'overflow': 'hidden',
            'position': 'absolute',
            'text-indent': '2px'
        })
        .style("background", function (d) {
            //return d.name ? (d.children ? p.getColor(d.name) : '') : 'white';
            //return d.children ? p.getColor(d.name) : '';
            return d.children ? '' : (d.color || p.getColor(d.name));
        })
        .text(function (d) {
            return d.children ? null : d.name;
        });
        p.block.attr("title", function (d) {
            return d.name + " : " + d3.format(",d")(d.value);
        });
        p.block.style("left", function (d) {
            return "0px";
        })
        .style("top", function (d) {
            return "0px";
        })
        .transition()
        .call(function setPosition() {
            this.style("left", function (d) {
                return d.x + "px";
            })
            .style("top", function (d) {
                return d.y + "px";
            })
            .style("width", function (d) {
                return Math.max(0, d.dx - 1) + "px";
            })
            .style("height", function (d) {
                return Math.max(0, d.dy - 1) + "px";
            });
        })
        .duration(p.delay);
        p.block
        .on("click", function (d, a, b) {
            return me.events["click"] ? me.events["click"]([d, a, b], me.proto, me) : null;
        })
        .on("contextmenu", function (d, a, b) {
            return me.events["contextmenu"] ? me.events["contextmenu"]([d, a, b], me.proto, me) : null;
        })
        .on("mouseover", function (d, a, b) {
            return me.events["mouseover"] ? me.events["mouseover"]([d, a, b], me.proto, me) : null;
        })
        .on("mouseleave", function (d, a, b) {
            return me.events["mouseleave"] ? me.events["mouseleave"]([d, a, b], me.proto, me) : null;
        });
        me.proto = p;
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }
        return cb
    };
    treemap.prototype.redrawCompare = function (callback) {
        var me = this, p = {}, cb;
        var parent = p.parent = me.parent,
            delay = p.delay = (me.delay || 750),
            padding = p.padding = (me.padding || 6),
            margin = p.margin = {top: 20, right: 0, bottom: 0, left: 0},
            width = p.width = $(parent).width(),
            height = p.height = $(parent).height() - margin.top - margin.bottom,
            formatNumber = p.formatNumber = d3.format(",d"),
            transitioning = p.transitioning,
            colors = p.colors = (me.colors || [
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
            ]),
            vid = p.vid = $(parent).attr('id');
        var x = p.x = d3.scale.linear().domain([0, width]).range([0, width]);
        var y = p.y = d3.scale.linear().domain([0, height]).range([0, height]);
        //
        var treemap = p.treemap = d3.layout.treemap()
        .children(function (d, depth) {
            return depth ? null : d._children;
        })
        .sort(function (a, b) {
            return a.value - b.value;
        })
        .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);
        var init = p.init = function (data) {
            data.x = data.y = 0;
            data.dx = width;
            data.dy = height;
            data.depth = 0;
        };
        var getAccumulate = p.getAccumulate = function (d) {
            // Aggregate the values for internal nodes. This is normally done by the
            // treemap layout, but not here because of our custom implementation.
            // We also take a snapshot of the original children (_children) to avoid
            // the children being overwritten when when layout is computed.
            return (d._children = d.children)
                ? d.value = d.children.reduce(function (p, v) {
                    return p + getAccumulate(v);
                }, 0) : d.value;
        };
        var setLayout = p.setLayout = function (d) {
            // Compute the treemap layout recursively such that each group of siblings
            // uses the same size (1×1) rather than the dimensions of the parent cell.
            // This optimizes the layout for the current zoom state. Note that a wrapper
            // object is created for the parent node for each group of siblings so that
            // the parent’s dimensions are not discarded as we recurse. Since each group
            // of sibling was laid out in 1×1, we must rescale to fit using absolute
            // coordinates. This lets us use a viewport to zoom.
            if (d._children) {
                treemap.nodes({_children: d._children});
                d._children.forEach(function (c) {
                    c.x = d.x + c.x * d.dx;
                    c.y = d.y + c.y * d.dy;
                    c.dx *= d.dx;
                    c.dy *= d.dy;
                    c.parent = d;
                    setLayout(c);
                });
            }
        };
        var setDisplay = p.setDisplay = function (d) {
            var depth = p.depth = group.insert("g", ".grandparent").datum(d).attr("class", "depth");
            var rectgroup = p.rectgroup = depth.selectAll("g").data(d._children).enter().append("g");
            var rect, title, label;
            rectgroup.selectAll(".child")
            .data(function (d) {
                return d._children || [d];
            })
            .enter().append("rect")
            .attr("class", "child")
            .style('fill', function (d) {
                return d.color
            })
            .call(setRectangular);
            rectgroup.filter(function (d) {
                return d._children;
            })
            .classed("children", true)
            .on("click", transition);
            //
            rect = p.rect = rectgroup.append("rect").attr("class", "parent");
            title = p.title = rectgroup.append("title");
            label = p.label = rectgroup.append("text").attr("dy", ".75em");
            rect.call(setRectangular);
            title.text(function (d) {
                return '"' + d.name + '" : ' + formatNumber(d.value);
            });
            label.text(function (d) {
                return d.name;
            }).call(setText);
            breadcrumb.parent.datum(d.parent).on("click", transition).select("text").text(setBCrumb(d));
            function transition(d) {
                if (transitioning || !d) return;
                transitioning = true;
                var display = setDisplay(d),
                    t1 = depth.transition().duration(delay),
                    t2 = display.transition().duration(delay);
                // Update the domain only after entering new elements.
                x.domain([d.x, d.x + d.dx]);
                y.domain([d.y, d.y + d.dy]);
                // Enable anti-aliasing during the transition.
                group.style("shape-rendering", null);
                // Draw child nodes on top of parent nodes.
                group.selectAll(".depth").sort(function (a, b) {
                    return a.depth - b.depth;
                });
                // Fade-in entering text.
                display.selectAll("text").style("fill-opacity", 0);
                // Transition to the new view.
                t1.selectAll("rect").call(setRectangular);
                t2.selectAll("rect").call(setRectangular);
                t1.selectAll("text").call(setText).style("fill-opacity", 0);
                t2.selectAll("text").call(setText).style("fill-opacity", 1);
                // Remove the old node when the transition is finished.
                t1.remove().each("end", function () {
                    group.style("shape-rendering", "crispEdges");
                    transitioning = false;
                });
            }

            var z = setTimeout(function () {
                clearTimeout(z);
                $('.treemap text').ready(function () {
                    label[0].forEach(function (text) {
                        var parent = d3.select(text.parentNode).select('.parent').node();
                        if (parent) {
                            var width = text.getBBox().width;
                            var height = text.getBBox().height;
                            var maxWidth = function () {
                                return parent.getBBox().width - ((padding * 2) * 2.75)
                            };
                            var maxHeight = function () {
                                return parent.getBBox().height - (padding * 2);
                            }
                            if ((maxHeight() <= 0) || (maxWidth() <= 0)) {
                                text.textContent = '';
                            } else {
                                if (maxHeight() >= height) {
                                    if (width >= maxWidth()) {
                                        for (var i = text.textContent.length; i > 0; i--) {
                                            if (maxWidth() > text.getSubStringLength(0, i)) {
                                                text.textContent = text.textContent.substring(0, i) + "..";
                                                return
                                            }
                                        }
                                    }
                                } else {
                                    text.textContent = '';
                                }
                            }
                        }
                    })
                })
            }, delay)
            svg.selectAll('g').selectAll('rect')
            .on("click", function (d, a, b) {
                return me.events["click"] ? me.events["click"]([d, a, b], me.proto, me) : null;
            })
            .on("contextmenu", function (d, a, b) {
                return me.events["contextmenu"] ? me.events["contextmenu"]([d, a, b], me.proto, me) : null;
            })
            .on("mouseover", function (d, a, b) {
                return me.events["mouseover"] ? me.events["mouseover"]([d, a, b], me.proto, me) : null;
            })
            .on("mouseleave", function (d, a, b) {
                return me.events["mouseleave"] ? me.events["mouseleave"]([d, a, b], me.proto, me) : null;
            });
            return rectgroup;
        };
        var setText = p.setText = function (el) {
            el.attr("x", function (d) {
                return x(d.x) + padding;
            })
            .attr("y", function (d) {
                return y(d.y) + padding;
            });
        };
        var setRectangular = p.setRectangular = function (rect) {
            rect.attr("x", function (d) {
                return x(d.x);
            })
            .attr("y", function (d) {
                return y(d.y);
            })
            .attr("width", function (d) {
                return x(d.x + d.dx) - x(d.x);
            })
            .attr("height", function (d) {
                return y(d.y + d.dy) - y(d.y);
            });
        };
        var setBCrumb = p.setBCrumb = function (d) {
            return d.parent ? (setBCrumb(d.parent) + " > " + d.name) : d.name;
        };
        //
        var svg = p.svg = d3.select(parent).append("svg").attr('class', 'treemap');
        var group = p.group = svg.append("g");
        var breadcrumb = p.breadcrumb = {};
        //
        breadcrumb.parent = group.append("g");
        breadcrumb.rec = breadcrumb.parent.append("rect");
        breadcrumb.label = breadcrumb.parent.append("text");
        svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px");
        group.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");
        breadcrumb.parent.attr("class", "grandparent");
        breadcrumb.rec.attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top);
        breadcrumb.label.attr("x", padding)
        .attr("y", padding - margin.top)
        .attr("dy", ".75em");
        //
        init(me.data);
        getAccumulate(me.data);
        setLayout(me.data);
        setDisplay(me.data);
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
     * description : if not set "config.data" at first instance treemap class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    treemap.prototype.normalize = function (callback) {
        var me = this, cb;
        var color = [
            '#E25669', '#F4D500', '#45AF94', '#FE8400', '#5FBCCE',
            '#0085B2', '#BFBFFF', '#886FC9', '#73B9FF', '#DC73FF',
            '#A2BF23', '#FED8AF', '#FAA5BA', '#FFE750', '#4EC5A3',
            '#63C8DE', '#0091C7', '#D6E1FF', '#A785FA', '#FDBBFF',
            '#C0E67C', '#FFB973', '#FF8544', '#FF6154', '#FFC566',
            '#A6CC35', '#2997C1', '#91C3FF', '#A83AA3', '#SC1378'
        ];
        var validate = function (val) {
            if (
                (val === undefined) ||
                (val === null) ||
                (val === false) ||
                (val === true) ||
                (val === '') ||
                (val.toString().replace(/\s{2,}/g, ' ') === ' ')
            ) val = 0;
            val = typeof val == 'string' ? val.toString().replace(/\n/g, '').replace(/\s{2,}/g, ' ') : val;
            return val;
        };
        var fn = function (fields, rows, pIdx, cIdx, vIdx) {
            var avoid = [pIdx, cIdx, vIdx];
            fn.crawl = function (obj) {
                obj.children.forEach(function (el, i) {
                    var found = fn.ROWS.filter(function (row) {
                        return row[pIdx] == obj.children[i].name
                    });
                    obj.children[i].children = found.map(function (el) {
                        return {
                            name: el[cIdx],
                            children: []
                        }
                    });
                    if (!found.length) {
                        delete obj.children[i].children;
                        var thisRow = fn.ROWS.filter(function (row) {
                            return row[cIdx] == obj.children[i].name
                        })[0];
                        obj.children[i].value = thisRow[vIdx];
                        thisRow.forEach(function (val, idx) {
                            if (avoid.indexOf(idx) === -1) {
                                obj.children[i][me.fields[idx]] = thisRow[idx];
                            }
                        });
                        obj.children[i].color = obj.children[i].color || color[i % color.length]
                    } else {
                        fn.crawl(el)
                    }
                    return el;
                });
                return obj;
            };
            fn.parents = []; //fake parents
            fn.PARENTS = []; //real parents
            fn.FIELDS = fields;
            fn.ROWS = rows.map(function (row) {
                var rw = row.map(function (r) {
                    return validate(r);
                });
                if (fn.parents.indexOf(rw[pIdx]) === -1) fn.parents.push(rw[pIdx]);
                return rw;
            });
            fn.parents.forEach(function (p) { //avoiding fake parents
                if (!fn.ROWS.filter(function (row) {
                        return row[cIdx] == p
                    }).length) {
                    fn.PARENTS.push(p)
                }
            });
            fn.result = {
                name: (me.name || '').toString(),
                children: fn.PARENTS.map(function (el) {
                    return {
                        name: el,
                        children: []
                    }
                })
            };
            return fn.crawl(fn.result)
        };
        //
        if (me.preprocess && (typeof me.preprocess == 'function')) me.preprocess(me)
        //
        // how to use fn?
        // fn(fields, rows, parentIdx, childIdx, valueIdx)
        me.rowIdx = me.rowIdx ? me.rowIdx.constructor == Object ? me.rowIdx : {} : {};
        var idx = {
            parent: !isNaN(me.rowIdx.parent) && isFinite(me.rowIdx.parent) ? me.rowIdx.parent : 0,
            child: !isNaN(me.rowIdx.child) && isFinite(me.rowIdx.child) ? me.rowIdx.child : 1,
            value: !isNaN(me.rowIdx.value) && isFinite(me.rowIdx.value) ? me.rowIdx.value : 2
        };
        me.data = fn(me.fields, me.rows, idx.parent, idx.child, idx.value);
        //me.data.children = me.data.children[0].children; //todo : hacking children.
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }
        return cb
    };
    treemap.prototype.normalizeCompare = treemap.prototype.normalize;
    /**
     * Invoke a d3 class!
     * @param config
     * @returns {treemap}
     */
    d3.treemap = function (config) {
        return new treemap(config)
    };
    //
    var styles = {
        "children": {
            "svg.treemap text": {
                "children": {},
                "attributes": {
                    'font-size': '10px',
                    'pointer-events': 'none',
                }
            },
            ".treemap .grandparent text": {
                "children": {},
                "attributes": {
                    'font-weight': 'bold'
                }
            },
            '.treemap rect': {
                "children": {},
                "attributes": {
                    'fill': 'none',
                    'stroke': '#fff'
                }
            },
            '.treemap rect.parent, .grandparent rect': {
                "children": {},
                "attributes": {
                    'stroke-width': '2px'
                }
            },
            '.treemap .grandparent rect': {
                "children": {},
                "attributes": {
                    'fill': ' #F1F1F1'
                }
            },
            '.treemap .grandparent:hover rect': {
                "children": {},
                "attributes": {
                    'fill': '#C4C4C4'
                }
            },
            '.treemap .children rect.parent, .grandparent rect': {
                "children": {},
                "attributes": {
                    'cursor': 'pointer'
                }
            },
            '.treemap .children rect.parent': {
                "children": {},
                "attributes": {
                    'fill': '#F1F1F1',
                    'fill-opacity': '.7'
                }
            },
            '.treemap .children rect.parent:hover': {
                "children": {},
                "attributes": {
                    'fill': 'rgba(0,0,0,0)',
                    'fill-opacity': '.2'
                }
            },
            /**
             * '.treemap .children:hover rect.child': {
             *   "children": {},
             *   "attributes": {
             *       'fill': '#bbb'
             *   }
             * }
             */
        },
        "attributes": {}
    };
    d3.toHEAD(d3.toCSS(styles));
})(d3);