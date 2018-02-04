var ProgressBar = function (config) {
    var me = this;
    if (!ProgressBar.loaded) me.load();
    d3.apply(me, config);
    me.events = me.events || {};
    return me;
};
ProgressBar.prototype.load = function () {
    var append = function (tag) {
        $("head").append($(tag));
    };
    //append("<link nouislider rel='stylesheet' type='text/css' href='/assets/plugins/noui-slider-8.1.0/nouislider.min.css'>");
    //append("<script nouislider type='text/javascript' src='/assets/plugins/noui-slider-8.1.0/nouislider.min.js'>");
    append("<style>" +
        ".tooltip-noUiSlider {" +
            "position: absolute;" +
            "border: 1px solid #D9D9D9;" +
            "font: 400 12px/12px Arial;" +
            "border-radius: 3px;" +
            "background: #fff;" +
            "top: 20px;" +
            "padding: 5px;" +
            "text-align: center;" +
        "}" +
        ".tooltip-noUiSlider strong {" +
            "display: block;" +
            "padding: 2px;" +
        "}" +
    "</style>");
    ProgressBar.loaded = true;
};
ProgressBar.prototype.init = function () {
    var me = this;
    var parent = $(me.parent);
    var tooltip = $('<div class="tooltip-noUiSlider">');
    noUiSlider.create(parent.get(0), {
        //limit: obj.limit,
        //behaviour: 'none',
        step: 1,
        start: 100,
        connect: "lower",
        direction: 'ltr',
        range: {
            'min': 1,
            'max': 10
        }
    });
    parent.find('.noUi-handle').append(tooltip);
};

(function (d3) {
    /**
     * Forcedirected instance
     * @param config : typeof Object
     * @returns {forcedirected}
     */
    var forcedirect = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        this.toolbars = this.toolbars || {};
        /*
        if (this.progress) if (this.progress.constructor == Object) {
            this.progress = new ProgressBar(this.progress);
            this.progress.visual = this;
            this.progress.init();
        }
        */
        return this;
    };
    /**
     * Adding chart toolbars
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    forcedirect.prototype.initToolbars = function () {
        var me = this;
        var tools = me.toolbars;
        //var top = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t-15">');
        var top = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">');
        //var bottom = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-b-10">');
        var bottom = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">');
        var obj = {
            resizer : function (config) {
                //
                var v = config.value = (config.value ? (config.value.constructor == Object ? config.value : {}) : {});
                var position = config.position = (config.position ? (config.position.constructor == String ? config.position : 'top') : 'top');
                var container = $('<div class="pull-right d3-toolbars">');
                var label = $('<label style="margin-right: 5px;font-size: small;"></label>');
                var resizer = $('<select>');
                var events = config.events || {};
                //
                if (config.label) container.append(label.html(config.label))
                if (v.max >= v.int > 0) {
                    var ar = [];
                    for (var i = v.int; i <= v.max; i+=v.int) {
                        ar.push(i);
                        resizer.append('<option value="'+ i +'">'+ i +'</option>');
                    }
                    if (ar[ar.length-1] != v.max) {
                        ar.push(v.max);
                        resizer.append('<option value="'+ v.max +'">'+ v.max +'</option>');
                    }
                    //set current value
                    resizer.val(me.rows$.length)

                    //adding events
                    resizer.on('change', function () {
                        if (events["change"]) {
                            me.isResized = true;
                            events["change"](this.value, me);
                        }
                    })

                    //adding to toolbar parents
                    if (config.position == 'top') {
                        if (config.float == true) top.css('position', 'absolute');
                        top.append(container.append(resizer));
                    }
                    if (config.position == 'bottom') {
                        if (config.float == true) {
                            bottom.css('position', 'absolute');
                            bottom.css('bottom', '0');
                        }
                        bottom.append(container.append(resizer));
                    }
                }
            }
        };
        if (tools && tools.constructor == Object) for (var t in tools) if (obj[t]) obj[t](tools[t]);
        //
        if (top.find('.d3-toolbars').length) $(me.proto.parent).prepend(top);
        if (bottom.find('.d3-toolbars').length) $(me.proto.parent).append(bottom);
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    forcedirect.prototype.redraw = function (callback) {
        var me = this, cb;
        var data = me.data;
        var p = me.proto = {};
        //*****************************************************************************************************************
        var parent = p.parent = me.parent;
        var width = p.width = $(parent).width();
        var height = p.height = $(parent).height();
        var charge = p.charge = -1 * (height >= width ? width : height) / 4;
        var color = p.color = d3.scale.category20();
        var linksDomain = p.linksDomain = data.links.map(function (arr) {
            return parseFloat(arr.value)
        });
        var bulletsRange = p.bulletsRange = p.bullets = (me.bullets ? me.bullets.constructor == Array ? me.bullets.length > 1 ? me.bullets : [5, 50] : [5, 50] || [5, 50] : [5, 50]).sort(function (a, b) {
            return a - b
        }), bulletsRange = [bulletsRange.shift(), bulletsRange.pop()];
        var linksRange = p.linksRange = p.links = (me.links ? me.links.constructor == Array ? me.links.length > 1 ? me.links : [1, 5] : [1, 5] || [1, 5] : [1, 5]).sort(function (a, b) {
            return a - b
        }), linksRange = [linksRange.shift(), linksRange.pop()];
        var linksScale = p.linksScale = d3.scale.quantile().domain(linksDomain).range(linksRange);
        var opacity = p.opacity = me.opacity || 0.9;
        var line_opacity = opacity / 1.5;
        var isText = me.text == false ? 'false' : true;
        var isTip = me.tip == false ? 'false' : true;
        var styles = {
            circle : {
                'stroke' : function (d) {
                    return d.color ? d.color : (d3.rgb(color(d.group)).brighter(0.8))
                },
                'stroke-width' : '1.5px',
                'stroke-opacity' : '1',
                'opacity' : opacity,
                'fill' : function (d) {
                    return d.color ? d.color : color(d.group);
                },
                'cursor' : 'pointer'
            },
            link : {
                'stroke' : '#999',
                'stroke-opacity' : line_opacity,
                'stroke-width' : function (d) {
                    return linksScale(d.value);
                }
            }
        };
        //
        $(parent).html('');
        //
        var force = p.force = d3.layout.force();
        var svg = p.svg = d3.select(parent).append("svg").attr({width : width, height : height});
        var link = p.link = svg.selectAll(".link").data(data.links).enter().append("line")
        var text, title, circle = p.circle = svg.selectAll('circle').data(data.nodes).enter().append('circle');
        var weight = data.nodes.map(function (nod, i) {
            return data.links.filter(function (lin) {
                return (lin.source == i) || lin.target == i
            }).length;
        }).sort(function (a, b) {
            return a - b
        });
        var maxWeight = weight[weight.length - 1], maxWeightCauseStoke = maxWeight + 2;
        //for focused feature *********************************************************************************************
        var tocolor = "fill";
        var towhite = "stroke";
        var default_link_color = "#888";
        var focus_node = null;
        var highlight_node = null;
        var highlight_trans = 0.1;
        var highlight_trans_fixed = opacity/10; //0.05; //0.001;
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
                svg.style("cursor", "move");
                if (highlight_color != "white") {
                    circle.style(towhite, "white");
                    text.style("font-weight", "normal");
                    link.style("stroke", function (o) {
                        return (isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color
                    });
                }
            }
        };
        var set_highlight = function (d) {
            svg.style("cursor", "pointer");
            if (focus_node !== null) d = focus_node;
            highlight_node = d;
            if (highlight_color != "white") {
                circle.style(towhite, function (o) {
                    return isConnected(d, o) ? highlight_color : "white";
                });
                text.style("font-weight", function (o) {
                    return isConnected(d, o) ? "bold" : "normal";
                });
                link.style("stroke", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color);
                });
            }
        };
        var set_focus = function (d) {
            if (highlight_trans < 1) {
                circle.style("opacity", function (o) {
                    return isConnected(d, o) ? opacity : highlight_trans;
                });
                link.style("opacity", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans_fixed;
                });
                if (isText == true) {
                    text.style("opacity", function (o) {
                        return isConnected(d, o) ? 1 : highlight_trans_fixed;
                    });
                }
            }
            circle.style("opacity", function (o) {
                return isConnected(d, o) ? opacity : highlight_trans_fixed;
            });
        };
        var mouseleaveevent = function (d) {
            if (focus_node !== null) {
                focus_node = null;
                if (highlight_trans < 1) {
                    circle.style("opacity", opacity)
                    if (isText == true) text.style("opacity", 1);
                }
            }
            link.style("opacity", 1);
            //if (highlight_node === null) exit_highlight();
        };
        var mouseoverevent = function (d, a, b) {
            d3.event.stopPropagation();
            focus_node = d;
            set_focus(d);
            //if (highlight_node === null) set_highlight(d)
        };
        //
        me.initToolbars();
        me.data.links.forEach(function (link, i) {
            linkedByIndex[link.source + "," + link.target] = true;
        });
        //*****************************************************************************************************************
        force.nodes(data.nodes).links(data.links)
            //.gravity(0)
            .friction(0.9)
            .linkStrength(function (d) {
                var a = d.source;
                var b = d.target;
                var min = bulletsRange[0];
                var max = bulletsRange[bulletsRange.length - 1];
                var wa = a.weight >= max ? max : a.weight <= min ? min : a.weight;
                var wb = b.weight >= max ? max : b.weight <= min ? min : b.weight;
                return Math.log1p((wa + wb) / 2)
            })
            .linkDistance(function (d) {
                var a = d.source;
                var b = d.target;
                var min = bulletsRange[0];
                var max = bulletsRange[bulletsRange.length - 1];
                var wa = a.weight >= max ? max : a.weight <= min ? min : a.weight;
                var wb = b.weight >= max ? max : b.weight <= min ? min : b.weight;
                return (((wa + wb) * linksScale(d.value)) + maxWeight) / 2
            })
            .charge(function (d) {
                var min = bulletsRange[0];
                var max = bulletsRange[bulletsRange.length - 1];
                var r = d.weight >= max ? max : d.weight <= min ? min : d.weight;
                return r * -10;
            })
            .theta(0.8)
            .alpha(0.1)
            .size([width, height])
            .start();
        link.style(styles.link).attr({
            class : "link",
            val : function (d) {
                return d.value
            }
        });
        circle.style(styles.circle).attr({
            class : 'circle',
            id : function (d, i) {
                return 'fd-circle-' + i
            },
            r : function (d) {
                var min = bulletsRange[0];
                var max = bulletsRange[bulletsRange.length - 1];
                return d.weight >= max ? max : d.weight <= min ? min : d.weight;
            }
        })
        if (isTip !== 'false' || isTip == true) {
            circle.append('title').text(function (d) {
                var all = data.links.filter(function (lin) {
                    return (lin.source.name == d.name) || (lin.target.name == d.name)
                })
                var score = all.map(function (a) {
                    return a.value
                });
                var val = 0;
                if (score.length) {
                    val = score.reduce(function (a, b) {
                        return b + a;
                    });
                    val = Math.round(val / score.length * 10) / 10;
                    val = score.length;
                }
                return [d.name, val].join(' : ');
            })
        }
        if (isText == true) {
            text = svg.selectAll(".text")
                .data(me.data.nodes).enter().append('text')
                .attr({
                    id : function (d) {
                        return 'fd-text-' + d.name
                    },
                    "x" : function (d) {
                        return d.x
                    },
                    "y" : function (d) {
                        return d.y
                    }
                })
                .style('font-size', 'smaller')
                //.text(function(d){ return d.name.toString() });
                .text(function (d) {
                    return d.name
                });
        }
        circle
            .on("dblclick", function (d) {
                d3.select(this).classed("fixed", d.fixed = false);
            })
            .call(force.drag().on("dragstart", function (d) {
                d3.select(this).classed("fixed", d.fixed = true);
            }));
        force.on("tick", function () {
            var z = setTimeout(function(){
                force.stop();
                clearTimeout(z); z = null;
            }, 5000)
            circle
                .attr("cx", function (d, i) {
                    var r = parseFloat(svg.select('#fd-circle-' + i).attr('r')) + 2;
                    return d.x = Math.max(r, Math.min(width - r, d.x));
                    return d.x;
                })
                .attr("cy", function (d, i) {
                    var r = parseFloat(svg.select('#fd-circle-' + i).attr('r')) + 2;
                    return d.y = Math.max(r, Math.min(height - r, d.y));
                    return d.y;
                });
            link
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
            if (isText == true) {
                text
                    .attr("x", function (d) {
                        return d.x + 7
                    })
                    .attr("y", function (d) {
                        return d.y + 3
                    });
            }
        });
        circle.on('click', function (d, a, b) {
            if (me.events["click"]) return me.events["click"]([d, a, b], me.proto, me)
        });
        circle.on('contextmenu', function (d, a, b) {
            if (me.events["contextmenu"]) return me.events["contextmenu"]([d, a, b], me.proto, me)
        });
        circle.on('mouseover', function (d, a, b) {
            mouseoverevent(d);
            if (me.events["mouseover"]) return me.events["mouseover"]([d, a, b], me.proto, me)
        });
        circle.on("mouseleave", function (d, a, b) {
            mouseleaveevent(d);
            if (me.events["mouseleave"]) return me.events["mouseleave"]([d, a, b], me.proto, me)
        });
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(p, me);
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
    forcedirect.prototype.normalize = function (callback, optSize) {
        var me = this, cb;
        var size = me.isResized ? optSize > 0 ? me.rows.length >= optSize ? optSize : me.rows.length : me.rows.length : me.size > 0 ? me.size : me.rows.length;
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
        me.rows$ = me.rows.slice(0, size);
        var collections = setUnique(me.rows$, [0, 1]).sort();
        var sources = setUnique(me.rows$, [0]).sort();
        var links = setUnique(me.rows$, [1]).sort(); //useless!
        me.data = {
            nodes : collections.map(function (source) {
                return ({
                    "name" : source,
                    "group" : Math.round(getRandom(100, 20))
                })
            }),
            links : me.rows$.map(function (row) {
                return ({
                    "source" : collections.indexOf(validate(row[0])),
                    "target" : collections.indexOf(validate(row[1])),
                    "value" : validate(row[2])
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
    forcedirect.prototype.normalizeCompare = function (callback, optSize) {
        var me = this, cb;
        var size = me.isResized ? optSize > 0 ? me.rows.length >= optSize ? optSize : me.rows.length : me.rows.length : me.size > 0 ? me.size : me.rows.length;
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
            var filterd = me.rows.filter(function (row) {
                return (row[0] == val || row[1] == val)
            });
            return filterd[0][3];
        }
        me.rows$ = me.rows.slice(0, size);
        var collections = setUnique(me.rows$, [0, 1]).sort();
        //var sources = setUnique(me.rows$, [0]).sort();
        //var links = setUnique(me.rows$, [1]).sort(); //useless!
        me.data = {
            nodes : collections.map(function (source) {
                return ({
                    "name" : source,
                    "color" : getColors(source)
                })
            }),
            links : me.rows$.map(function (row) {
                return ({
                    "source" : collections.indexOf(validate(row[0])),
                    "target" : collections.indexOf(validate(row[1])),
                    "value" : validate(row[2])
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
    /**
     * Invoke a d3 class!
     * @param config
     * @returns {forcedirect}
     */
    d3.forcedirect = function (config) {
        return new forcedirect(config)
    };
})(d3);