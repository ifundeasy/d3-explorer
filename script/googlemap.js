(function () {
    /**
     * Googlemap instance
     * @param config : typeof Object
     * @returns {googlemap}
     */
    var googlemap = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    }
    //
    googlemap.prototype.update = undefined;
    //
    googlemap.prototype.redraw = function () {
        var me = this, p = {};
        me.proto = p;
        p.events = me.events || {};
        p.parent = me.parent;
        p.height = $(p.parent).height();
        p.width = $(p.parent).width();
        p.minSize = parseFloat((me.minSize ? me.minSize : 0) || 1);
        p.maxSize = parseFloat((me.maxSize ? me.maxSize : 0) || 100);
        p.fontSize = parseFloat((me.fontSize ? me.fontSize : 0) || 12);
        p.opacity = parseFloat((me.opacity ? me.opacity : 0) || 0.8);
        p.types = ["roadmap", "satellite", "hybrid", "terrain"];
        p.zoom = parseFloat((me.zoom ? me.zoom : 0) || 5);
        p.latitude = parseFloat((me.latitude ? me.latitude : 0) || -2.548926);
        p.longitude = parseFloat((me.longitude ? me.longitude : 0) || 118.0148634);
        p.type = (p.types.indexOf((me.type ? me.type : 0)) !== -1 ? me.type : 'roadmap').toLowerCase();
        $(p.parent).html('');
        p.color = d3.scale.category20();
        p.options = {
            zoom: p.zoom,
            center: new google.maps.LatLng(p.latitude, p.longitude),
            mapTypeId: google.maps.MapTypeId[p.type.toUpperCase()]
        };
        p.map = new google.maps.Map($(me.parent).get(0), p.options);
        p.overlay = new google.maps.OverlayView();
        p.domainVal = me.data.map(function (data) {
            return data.log
        }).sort(d3.ascending);
        p.rangeVal = [p.minSize, p.maxSize].sort(d3.ascending);
        p.scale = d3.scale.ordinal()
        .domain(p.domainVal)
        .rangePoints(p.rangeVal);
        console.log(me.data)
        // Add the container when the overlay is added to the map.
        p.overlay.onAdd = function () {
            //var layer = d3.select(this.getPanes().overlayLayer).append("div")
            var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "stations");
            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?
            p.overlay.draw = function () {
                var projection = this.getProjection();
                var svg = layer.selectAll("svg")
                .data(me.data)
                .each(transform) // update existing markers
                .enter().append("svg:svg")
                .attr({
                    width: function (d) {
                        return p.scale(d.log)
                    },
                    height: function (d) {
                        return p.scale(d.log)
                    }
                })
                .style({
                    width: function (d) {
                        return Math.round(p.scale(d.log)) + 'px'
                    },
                    height: function (d) {
                        return Math.round(p.scale(d.log)) + 'px'
                    }
                })
                .each(transform)
                .attr("class", "marker");
                // Add a circle.
                var circle = svg.append("svg:circle");
                circle.append('title').text(function (d) {
                    return ([d.name, d.size].join(' : '))
                })
                circle.attr({
                    "circle-count": function (d, i) {
                        return ("gmap-circle-" + i)
                    },
                    "r": function (d) {
                        return p.scale(d.log) / 2.5
                    },
                    "cx": function (d) {
                        return this.parentElement.getAttribute('width') / 2
                    },
                    "cy": function (d) {
                        return this.parentElement.getAttribute('height') / 2
                    },
                })
                .style({
                    cursor: 'auto',
                    opacity: p.opacity,
                    fill: function (d, i) {
                        var color = p.color(i);
                        if (d.color) color = d.color;
                        return d3.rgb(color)
                    },
                    stroke: function (d, i) {
                        var color = p.color(i);
                        if (d.color) color = d.color;
                        //return d3.rgb(color).darker()
                        return d3.rgb(color)
                    },
                    'stroke-width': '1.5px'
                })
                .on('click', function (d, a, b) {
                    if (p.events["click"]) return p.events["click"]([d, a, b], p, me)
                })
                .on('mouseover', function (d, a, b) {
                    if (p.events["mouseover"]) return p.events["mouseover"]([d, a, b], p, me)
                })
                .on('mouseleave', function (d, a, b) {
                    if (p.events["mouseleave"]) return p.events["mouseleave"]([d, a, b], p, me)
                })
                .on('contextmenu', function (d, a, b) {
                    if (p.events["contextmenu"]) return p.events["contextmenu"]([d, a, b], p, me)
                });
                // Add a label.
                /*svg.append("svg:text")
                    .style({
                        cursor : 'auto'
                    })
                    .attr({
                        "dy" : ".31em",
                        "circle-text-count" : function (d, i) {
                            return ("gmap-circle-text-" + i)
                        },
                        "text-anchor" : 'middle',
                        "x" : function (d) {
                            return this.parentElement.getAttribute('width') / 2
                        },
                        "y" : function (d) {
                            return this.parentElement.getAttribute('height') / 2
                        },
                        "font-size" : p.fontSize
                    })
                    .text(function (d) {
                        return d.name;
                    });*/
                function transform(d) {
                    var pixel = new google.maps.LatLng(d.longitude, d.latitude);
                    var proPixel = projection.fromLatLngToDivPixel(pixel);
                    return d3.select(this)
                    .style({
                        //"border": "1px solid",
                        "position": 'absolute',
                        "left": function (dd) {
                            return (proPixel.x - (p.scale(dd.log) / 2)) + "px";
                        },
                        "top": function (dd) {
                            return (proPixel.y - (p.scale(dd.log) / 2)) + "px";
                        }
                    })
                }
            };
        };
        //Bind our overlay to the map
        p.overlay.setMap(p.map);
    };
    googlemap.prototype.redrawCompare = function () {
        var me = this, p = {};
        me.proto = p;
        p.events = me.events || {};
        p.parent = me.parent;
        p.height = $(p.parent).height();
        p.width = $(p.parent).width();
        p.minSize = parseFloat((me.minSize ? me.minSize : 0) || 1);
        p.maxSize = parseFloat((me.maxSize ? me.maxSize : 0) || 100);
        p.fontSize = parseFloat((me.fontSize ? me.fontSize : 0) || 12);
        p.opacity = parseFloat((me.opacity ? me.opacity : 0) || 0.8);
        p.types = ["roadmap", "satellite", "hybrid", "terrain"];
        p.zoom = parseFloat((me.zoom ? me.zoom : 0) || 5);
        p.latitude = parseFloat((me.latitude ? me.latitude : 0) || -2.548926);
        p.longitude = parseFloat((me.longitude ? me.longitude : 0) || 118.0148634);
        p.type = (p.types.indexOf((me.type ? me.type : 0)) !== -1 ? me.type : 'roadmap').toLowerCase();
        //
        $(p.parent).html('');
        //
        p.color = d3.scale.category20();
        p.options = {
            zoom: p.zoom,
            center: new google.maps.LatLng(p.latitude, p.longitude),
            mapTypeId: google.maps.MapTypeId[p.type.toUpperCase()]
        };
        p.map = new google.maps.Map($(me.parent).get(0), p.options);
        p.overlay = new google.maps.OverlayView();
        //
        p.overlay.onAdd = function () {
            var element = this.getPanes().overlayMouseTarget;
            var layer = d3.select(element);
            var parent = layer.append("div").attr("class", "stations");
            var domainVal = me.domainVal.sort(d3.ascending);
            var rangeVal = [p.minSize, p.maxSize].sort(d3.ascending);
            var getScale = d3.scale.ordinal().domain(domainVal).rangePoints(rangeVal);
            var getSize = function (data) {
                return getScale(data.log / Object.keys(data.colors).length)
            };
            var compare = Object.keys(App.compare).map(function (c) {
                return App.compare[c]
            });
            var pie = d3.layout.pie().sort(null).value(function (d) {
                return d.value;
            });
            var getKey = function (d) {
                if (d.data.color != undefined)return d.data.label + d.data.color;
                return d.data.label;
            };
            var getMidAngle = function (d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
            };
            p.overlay.draw = function () {
                var projection = this.getProjection();
                var each = function (data) {
                    //console.log(JSON.stringify(data))
                    var size = getSize(data) / 2;
                    var longitude = data.longlat[0];
                    var latitude = data.longlat[1];
                    var pixel = new google.maps.LatLng(latitude, longitude);
                    var proPixel = projection.fromLatLngToDivPixel(pixel);
                    return d3.select(this).style({
                        //"border" : "1px solid",
                        "position": 'absolute',
                        "left": (proPixel.x - size) + "px",
                        "top": (proPixel.y - size) + "px"
                    });
                };
                var svg = parent.selectAll("svg").data(me.data).each(each).enter().append("svg");
                svg
                .attr({
                    "width": getSize,
                    "height": getSize
                })
                .style({
                    width: function (d) {
                        return Math.round(getSize(d)) + 'px'
                    },
                    height: function (d) {
                        return Math.round(getSize(d)) + 'px'
                    }
                })
                .each(each)
                .attr("class", "marker");
                var group = svg.append("g");
                group.append("g").attr("class", "slices");
                group.append("g").attr("class", "labels");
                group.append("g").attr("class", "lines");
                group.attr({
                    transform: function (d) {
                        return "translate(" + getSize(d) / 2 + "," + getSize(d) / 2 + ")";
                    }
                });
                group.each(function (_data) {
                    var raw = Object.keys(_data.colors).map(function (c) {
                        var x = _data.colors[c];
                        var labels = compare.filter(function (el) {
                            return el.color == c
                        });
                        return ({
                            color: c,
                            value: x[0],
                            label: labels[0].name
                        })
                    });
                    var g = d3.select(this);
                    var radius = getSize(_data) / 2;
                    var arc = d3.svg.arc()
                    .outerRadius(radius * 1)
                    .innerRadius(radius * 0.5);
                    var outerArc = d3.svg.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9);
                    var slice = g.select(".slices").selectAll("path.slice").data(pie(raw), getKey);
                    //
                    slice
                    .enter()
                    .insert("path")
                    .style({
                        opacity: p.opacity,
                        stroke: function (d) {
                            return d3.rgb(d.data.color).darker()
                        },
                        fill: function (d) {
                            return d.data.color
                        }
                    })
                    .attr("class", "slice")
                    .transition()
                    .duration(1000)
                    .attrTween("d", function (d) {
                        this._current = {"data": {"label": "", "value": 0}, "value": 0, "startAngle": 0, "endAngle": 0, "padAngle": 0};
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function (t) {
                            return arc(interpolate(t));
                        };
                    });
                    //
                    slice.exit().remove();
                });
            };
        };
        //
        p.overlay.setMap(p.map);
    };
    //
    googlemap.prototype.normalize = function (callback) {
        var me = this, cb;
        me.data = [];
        me.rows.forEach(function (row, i) {
            var obj = {};
            row.forEach(function (r, j) {
                if (me.fields[j]) obj[me.fields[j]] = r;
                obj.log = d3.scale.log()(obj.size) || 0;
            });
            me.data.push(obj);
        });
        me.sizes = [];
        me.data.forEach(function (data) {
            me.sizes.push(data.size || 0)
        });
        me.sizes.sort(d3.ascending);
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }
        return cb
    };
    googlemap.prototype.normalizeCompare = function (callback) {
        var me = this, cb;
        me.data = [];
        me.domainVal = [];
        var temp = {}
        me.rows.forEach(function (row, i) {
            temp[row[0]] = 0;
        });
        for (var t in temp) {
            var any = me.rows.filter(function (r) {
                return r[0] == t
            });
            var sampel = any[0];
            me.data.push({
                name: sampel[0],
                longlat: [sampel[2], sampel[1]],
                log: (function () {
                    var o = 0;
                    any.forEach(function (a) {
                        o += a[4];
                    })
                    return o
                })(),
                colors: (function () {
                    var o = {};
                    any.forEach(function (a) {
                        o[a[5]] = [a[4], a[3]];
                    })
                    return o
                })()
            })
        }
        me.data.forEach(function (row) {
            var val = row.log / Object.keys(row.colors).length;
            if (me.domainVal.indexOf(val) == -1) me.domainVal.push(val)
        });
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }
        return cb
    };
    /*
     * Adding google maps api script!
     */
    var testr = [],
        scripts = document.getElementsByTagName('script'),
        src = 'http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=';
    for (var f = 0; f < scripts.length; f++) {
        if (scripts[f].src.indexOf(src) !== -1) {
            testr.push(src);
            break;
        }
        testr.push(scripts[f].src);
    }
    if (!window.google && (testr.indexOf(src) == -1)) { //avoid duplicate script!
        var time = 'init' + (new Date()).getTime().toString();
        var script = document.createElement("script");
        window[time] = function () {
            /**
             * Invoke a d3 class!
             * @param config
             * @returns {googlemap}
             */
            d3.googlemap = function (config) {
                return new googlemap(config)
            };
            return d3.googlemap;
        };
        script.type = "text/javascript";
        script.src = src + time;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
})();