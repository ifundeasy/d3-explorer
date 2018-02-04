(function (d3) {
    /**
     * Timeline instance
     * @param config : typeof Object
     * @returns {timeline}
     */
    var groupTimeline = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    groupTimeline.prototype.redraw = function (callback) {
        var me = this, cb;
        var p = {
            parent: me.parent
        };

        p.width = $(p.parent).width();
        p.height = $(p.parent).height();

        $(p.parent).html('');

        if (!$(p.parent).attr('id')) $(p.parent).attr('id', (new Date().getTime()).toString(32));

        p.vid = $(p.parent).attr('id');
        for (var i = 0; i < me.data.length; i++) {
            //console.log(me.data[i])
            var color = (i % 2) ? 'none' : '#F9F9F9';
            var id = p.vid + '-row-' + i;
            var html =
                '<div class="m-t-0" id="' + id + '" style="background-color:' + color + '; padding:5px">' +
                '<div>' +
                '<p class="no-margin fs-16">' + me.data[i].group + '</p>';
            for (var j = 0; j < me.data[i].val.length; j++) {
                //console.log(me.data[i].val[j])
                var img = 'assets/img/pamedi/' + me.data[i].val[j][3];
                html += '<p class="hint-text m-t-5 small">' + me.data[i].val[j][0] + '</p>' +
                    '<p class="hint-text m-t-5 small">' +
                    //'<img alt="Avatar" width="12" height="12" data-src-retina="'+ img +'" data-src="'+ img +'" src="'+ img +'">' +
                    //'<span style="margin-left: 5px">' + me.data[i].val[j][3] + ' | ' + me.data[i].val[j][1] +'</span>'+
                    '<span style="margin-left: 5px"> <img alt="Avatar"  height="12px" data-src-retina="' + img + '" data-src="' + img + '" src="' + img + '" title="' + me.data[i].val[j][3] + '"> | ' + me.data[i].val[j][1] + '</span>' +
                    '</p>';
            }
            html += '</div></div>';
            $(p.parent).append(html);
        }
        me.proto = p;

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }
        return cb
    };
    groupTimeline.prototype.redrawCompare = groupTimeline.prototype.redraw;
    /**
     * Normalize data
     * description : if not set "config.data" at first instance timeline class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    groupTimeline.prototype.normalize = function (callback) {
        var me = this, cb;

        me.data = [];
        for (var i = 0; i < me.rows.length; i++) {
            //console.log(me.rows[i]);
            me.findGr(me.rows[i])

        }
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }
        return cb;
    };
    groupTimeline.prototype.normalizeCompare = groupTimeline.prototype.normalize;
    //
    groupTimeline.prototype.findGr = function (par) {
        var val = [];
        var me = this;
        for (var i = 0; i < me.data.length; i++) {
            if (par[0] == me.data[i].group) {
                me.data[i].val.push([par[1], par[2], par[3], par[4], par[5]]);
                return true;
            }
        }
        val = [[par[1], par[2], par[3], par[4], par[5]]]
        me.data.push({group: par[0], val: val})
        return false;
    };
    /**
     * Invoke a d3 class!
     * @param config
     * @returns {timeline}
     */
    d3.groupTimeline = function (config) {
        return new groupTimeline(config)
    };
})(d3);