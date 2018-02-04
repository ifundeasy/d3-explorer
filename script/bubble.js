(function (d3) {
    /**
     * Bubble instance
     * @param config : typeof Object
     * @returns {bubble}
     */
    var bubble = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    bubble.prototype.redraw = function (callback) {
        var me = this, cb;
        var p = {
            parent: me.parent,
            padding: me.padding || 1,
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

        p.width = $(p.parent).width();
        p.height = $(p.parent).height();
        p.radius = Math.min(p.width, p.height) / 2;
        p.getColor = p.colors.constructor == Array ? d3.scale.category20c().range(p.colors) : d3.scale.category20c();

        $(p.parent).html('');

        if (!$(p.parent).attr('id')) $(p.parent).attr('id', (new Date().getTime()).toString(32));

        p.vid = $(p.parent).attr('id');

        p.bubble = d3.layout.pack()
        .sort(null)
        .size([p.width, p.height])
        .padding(p.padding);
        p.svg = d3.select("#" + p.vid).append("svg")
        .attr("width", p.width)
        .attr("height", p.height)
        .attr("class", "bubble")
        .on('contextmenu', function () {
            d3.event.preventDefault();
        });
        p.node = p.svg.selectAll(".node")
        .data(p.bubble.nodes({children: me.data})
        .filter(function (d) { return !d.children; }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        p.node.append("title")
        .text(function (d) { return d.className + ": " + d3.format(",d")(d.value); });
        p.circle = p.node.append("circle")
        .style("fill", function (d) { return p.getColor(d.className); })
        .on('click', function (d, a, b) {
            return me.events["click"] ? me.events["click"]([d, a, b], me.proto, me) : null;
        })
        .on('contextmenu', function (d, a, b) {
            return me.events["contextmenu"] ? me.events["contextmenu"]([d, a, b], me.proto, me) : null;
        })
        .on("mouseover", function (d, a, b) {
            return me.events["mouseover"] ? me.events["mouseover"]([d, a, b], me.proto, me) : null;
        })
        .on("mouseleave", function (d, a, b) {
            return me.events["mouseleave"] ? me.events["mouseleave"]([d, a, b], me.proto, me) : null;
        });

        p.circle.attr("r", 0).transition()
        .attr("r", function (d) { return d.r;})
        .style("cursor", "pointer")
        .duration(p.delay);

        p.circleText = p.node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("font", "10px sans-serif")
        .style("cursor", "pointer")
        .style("display", "none")
        .text(function (d) { return d.className.substring(0, d.r / 3); });

        p.circleText.transition().style("display", "").delay(p.delay * 3 / 2);
        d3.select(self.frameElement).style("height", p.width + "px");

        me.proto = p;
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }
        return cb
    };
    bubble.prototype.redrawCompare = function (callback) {
        var me = this, cb;
        var p = {
            parent: me.parent,
            padding: me.padding || 1,
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

        p.width = $(p.parent).width();
        p.height = $(p.parent).height();
        p.radius = Math.min(p.width, p.height) / 2;
        p.getColor = p.colors.constructor == Array ? d3.scale.category20c().range(p.colors) : d3.scale.category20c();

        $(p.parent).html('');

        if (!$(p.parent).attr('id')) $(p.parent).attr('id', (new Date().getTime()).toString(32));

        p.vid = $(p.parent).attr('id');

        p.bubble = d3.layout.pack()
        .sort(null)
        .size([p.width, p.height])
        .padding(p.padding);
        p.svg = d3.select("#" + p.vid).append("svg")
        .attr("width", p.width)
        .attr("height", p.height)
        .attr("class", "bubble")
        .on('contextmenu', function () {
            d3.event.preventDefault();
        });
        p.node = p.svg.selectAll(".node")
        .data(p.bubble.nodes({children: me.data})
        .filter(function (d) { return !d.children; }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        p.node.append("title")
        .text(function (d) { return d.className + ": " + d3.format(",d")(d.value); });
        p.circle = p.node.append("circle")
        .style("fill", function (d) {
            return d.color;
        })
        .on('click', function (d, a, b) {
            return me.events["click"] ? me.events["click"]([d, a, b], me.proto, me) : null;
        })
        .on('contextmenu', function (d, a, b) {
            return me.events["contextmenu"] ? me.events["contextmenu"]([d, a, b], me.proto, me) : null;
        })
        .on("mouseover", function (d, a, b) {
            return me.events["mouseover"] ? me.events["mouseover"]([d, a, b], me.proto, me) : null;
        })
        .on("mouseleave", function (d, a, b) {
            return me.events["mouseleave"] ? me.events["mouseleave"]([d, a, b], me.proto, me) : null;
        });

        p.circle.attr("r", 0).transition()
        .attr("r", function (d) { return d.r;})
        .style("cursor", "pointer")
        .duration(p.delay);

        p.circleText = p.node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("font", "10px sans-serif")
        .style("cursor", "pointer")
        .style("display", "none")
        .text(function (d) { return d.className.substring(0, d.r / 3); });

        p.circleText.transition().style("display", "").delay(p.delay * 3 / 2);
        d3.select(self.frameElement).style("height", p.width + "px");

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
     * description : if not set "config.data" at first instance bubble class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    bubble.prototype.normalize = function (callback) {
        var me = this, cb;

        me.valueSum = 0;
        me.data = me.rows.map(function (row, i) {
            me.valueSum += row[1];
            return ({
                "className": row[0],
                "value": row[1]
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
    bubble.prototype.normalizeCompare = function (callback) {
        var me = this, cb;

        me.valueSum = 0;
        me.data = me.rows.map(function (row, i) {
            me.valueSum += row[1];
            return ({
                "className": row[0],
                "value": row[1],
                "color": row[2]
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

    /**
     * Invoke a d3 class!
     * @param config
     * @returns {bubble}
     */
    d3.bubble = function (config) {
        return new bubble(config)
    };
})(d3);