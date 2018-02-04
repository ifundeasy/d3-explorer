(function (d3) {
    /**
     * Timeline instance
     * @param config : typeof Object
     * @returns {timeline}
     */
    var timeline = function (config) {
        d3.apply(this, config);
        this.query = config.query || '';
        this.from = config.from || 0;
        this.size = config.size || 10;
        this.total = config.total || 0;
        this.events = this.events || {};
        this.page = config.page || '';
        return this;
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    timeline.prototype.redraw = function (callback) {
        var me = this, cb;
        var p = {
            parent: me.parent
        };

        p.width = $(p.parent).width();
        p.height = $(p.parent).height();

        $(p.parent).html('');

        if (!$(p.parent).attr('id')) $(p.parent).attr('id', (new Date().getTime()).toString(32));

        p.vid = $(p.parent).attr('id');
        if (this.page == '') {
            p.setTemplate = function (data, i) {
                var txt = data.synopsis;
                if (data["statement.person"]) {
                    txt = '';
                    for (var j = 0; j < data["statement.person"].length; j++) {
                        txt += '<b>' + data["statement.person"][j] + '</b> : <i>"' + data["statement.statement"][j] + '"</i><br />';
                    }
                }
                var color = (i % 2) ? 'none' : '#F9F9F9';
                var id = p.vid + '-row-' + i;
                var img = 'assets/img/pamedi/' + data.media;
                var html = $(
                    '<div class="m-t-0" id="' + id + '" style="background-color:' + color + '; padding:5px; margin-right:8px;">' +
                    //'<div id="'+ id + '-container' +'" class="b-b b-grey">' +
                    '<div id="' + id + '-container' + '">' +
                    '<p id="' + id + '-title' + '" class="no-margin fs-16" style="cursor: pointer;">' + data.title + '</p>' +
                    '<p id="' + id + '-sinopsis' + '" class="hint-text m-t-5 small">' + txt + '</p>' +
                    '<p id="' + id + '-footer' + '" class="hint-text m-t-5 small">' +
                    '<span><img alt="Avatar"  height="12px" data-src-retina="' + img + '" data-src="' + img + '" src="' + img + '" title="' + data.media + '"> | ' + data.date + ' | ' + data.sentiment + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</div>'
                );

                $(p.parent).append(html);
                $('#' + id + '-container').data(data);

                if (me.events["click"]) {
                    var el = $('#' + id + '-title');

                    el.data(data);
                    el.on("click", function (event) {
                        var target = $(event.target);
                        return me.events["click"](data, target, me.proto, me, event)
                    });
                }

            };
        } else {
            p.setTemplate = function (data, i) {
                var txt = data.text;
                //				if (data["statement.person"]) {
                //					txt = '';
                //					for (var j=0;j<data["statement.person"].length;j++) {
                //						txt += '<b>'+data["statement.person"][j] + '</b> : <i>"' + data["statement.statement"][j] + '"</i><br />';
                //					}
                //				}
                var color = (i % 2) ? 'none' : '#F9F9F9';
                var id = p.vid + '-row-' + i;
                var img = data["user.profile_image_url"];
                var html = $(
                    '<div class="m-t-0" id="' + id + '" style="background-color:' + color + '; padding:5px; margin-right:8px;">' +
                    //'<div id="'+ id + '-container' +'" class="b-b b-grey">' +
                    '<img alt="Avatar"  height="50px" width="50px" data-src-retina="' + img + '" data-src="' + img + '" src="' + img + '" title="' + data["user.name"] + '">' +
                    '<div id="' + id + '-container' + '">' +
                    '<p id="' + id + '-title' + '" class="no-margin fs-16" style="cursor: pointer;">' + data["user.name"] + '</p>' +
                    '<p id="' + id + '-sinopsis' + '" class="hint-text m-t-5 small">' + txt + '</p>' +
                    '<p id="' + id + '-footer' + '" class="hint-text m-t-5 small">' +
                    '<span style="margin-left: 5px"> ' + data.date + ' | ' + data.sentiment + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</div>'
                );

                $(p.parent).append(html);
                $('#' + id + '-container').data(data);

                if (me.events["click"]) {
                    var el = $('#' + id + '-title');

                    el.data(data);
                    el.on("click", function (event) {
                        var target = $(event.target);
                        return me.events["click"](data, target, me.proto, me, event)
                    });
                }
            }
        }
        if (me.total > 0) {
            $(p.parent + '-paging span').text('Show more articles (' + me.total + ' articles)');
        }
        $(p.parent + '-paging').unbind('click');
        $(p.parent + '-paging').on('click', function (ev) {
            me.from += 10;
            me.query["from"] = me.from;
            var ds = new FdsSource({
                q: me.query
            });
            ds.query(me);

        });

        me.data.forEach(p.setTemplate);
        me.proto = p;

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }
        return cb
    };
    timeline.prototype.redrawCompare = timeline.prototype.redraw;
    /**
     * Normalize data
     * description : if not set "config.data" at first instance timeline class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    timeline.prototype.normalize = function (callback) {
        var me = this, cb;
        me.data = me.rows.map(function (row, i) {
            var r = {};
            row.forEach(function (el, j) {
                r[me.fields[j]] = el
            });
            return r
        });
        //console.info(me.data)
        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.data, me);
        } else {
            cb = me;
        }
        return cb
    };
    timeline.prototype.normalizeCompare = timeline.prototype.normalize;
    /**
     * Invoke a d3 class!
     * @param config
     * @returns {timeline}
     */
    d3.timeline = function (config) {
        return new timeline(config)
    };
})(d3);