(function (d3) {
    /**
     * Carousel instance
     * @param config : typeof Object
     * @returns {carousel}
     */
    var carousel = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };

    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    carousel.prototype.redraw = function (callback) {
        var me = this, cb;
        var p = {
            interval: parseInt(me.slideInterval) || false,
            parent: me.parent,
            steps: me.steps || 3,
            getItems: function (much) {
                var me = this;
                return ((much / me.steps) > Math.floor(much / me.steps)) ? (Math.floor(much / me.steps) + 1) : (Math.floor(much / me.steps));
            }
        };

        p.width = $(p.parent).width();
        p.height = $(p.parent).height();
        p.items = p.getItems(me.fields.length);

        $(p.parent).html('');

        if (!$(p.parent).attr('id')) $(p.parent).attr('id', (new Date().getTime()).toString(32));
        p.vid = $(p.parent).attr('id');
        p.cid = p.vid + '-carousel';

        p.container = $(
            '<div id="' + p.cid + '" class="carousel slide" data-interval="' + p.interval + '" data-ride="carousel" style="width: ' + p.width + 'px;">' +
            '<a class="left carousel-control" href="#' + p.cid + '" role="button" data-slide="prev">' +
            '<span class="glyphicon glyphicon-chevron-left carousel-nav-left" aria-hidden="true"></span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '<a class="right carousel-control" href="#' + p.cid + '" role="button" data-slide="next">' +
            '<span class="glyphicon glyphicon-chevron-right carousel-nav-right" aria-hidden="true"></span>' +
            '<span class="sr-only">Next</span>' +
            '</a>' +
            '</div>'
        );
        p.control = $('<ol class="carousel-indicators carousel-indicator-bottom">');
        p.content = $('<div class="carousel-inner carousel-inner-fit" role="listbox">');
        p.container.prepend(p.control, p.content);
        p.setTable = function (el, i, id, cls) {
            var clss = 'col-lg-' + cls + ' col-md-' + cls + ' col-sm-' + cls + ' col-xs-' + cls;
            var tableId = id + '-table-' + i;
            var title = (function (val) {
                var d = false;
                try {
                    if (new Date(parseInt(val)) != 'Invalid Date') d = true;
                } catch (e) {
                }
                ;

                var nD = val.slice(0, 4);
                if (val.slice(4, 6).length > 0) {
                    nD += "-" + val.slice(4, 6)
                }
                if (val.slice(6, 8).length > 0) {
                    nD += "-" + val.slice(6, 8)
                }
                if (val.slice(8, 10).length > 0) {
                    nD += " " + val.slice(8, 10)
                }
                return d ? nD : val; //val = val.slice(0, 4) + '-' + val.slice(4, 6) + '-' + val.slice(6, 8) : val;
            })(el);
            var table = $(
                '<div class="' + clss + '" style="padding: 0px 2px;">' +
                '<table id="' + tableId + '"class="table table-bordered table-striped text-center">' +
                '<thead><tr><th class="text-center">' + title + '</th></tr></thead>' +
                '<tbody></tbody>' +
                '</table>' +
                '</div>'
            );
            var handle = function (id) {
                $('#' + id).css({
                    'width': $('#' + id).width() + 'px',
                    'white-space': 'nowrap',
                    'overflow': 'hidden',
                    'text-overflow': 'ellipsis',
                    'cursor': 'pointer'
                });
                $('#' + id).on('click', function (event) {
                    if (me.events['click']) {
                        var elm = $(event.target);
                        var data = elm.data();
                        me.events['click'].apply(me.events['click'], [data, p, me, elm])
                    }
                });
            };
            $('#' + id).append(table);
            me.data[el].forEach(function (content, j) {
                var id = tableId + '-row-' + j;
                var tr = $('<tr>');
                var td = $('<td>');
                //				if(content.indexof('~') == '-1'){
                //					var div = $('<div id="' + id + '" title="' + content + '">' + content + '</div>')
                //				}else{
                //					var div = $('<div id="' + id + '" title="' + content.split('~')[1] + '">' + content.split('~')[0] + '</div>')
                //				}
                //var div = $('<div id="' + id + '" title="' + content + '">' + content + '</div>')
                var div = $('<div id="' + id + '" title="' + content.split('~')[0] + '" style="color:' + content.split('~')[1] + ';font-weight:500;text-shadow: rgba(190,190,190,1) 0px 0px 3px;">' + content.split('~')[0] + '</div>')
                div.data({key: el, value: content});
                tr.append(td);
                td.append(div);
                table.find('tbody').append(tr);
                var z = setInterval(function () {
                    if ($('#' + id).width() > 0) {
                        clearInterval(z);
                        handle(id)
                    }
                }, 1000);
            });
        };

        $('#' + p.vid).append(p.container);

        var itm = 0, cnt = 0;
        var fields = [];
        me.fields.forEach(function (el) {
            if (me.data[el].length) fields.push(el)
        });
        fields.forEach(function (el, i) {
            var act = (i == 0 ? ' active' : '');
            if (i % p.steps === 0) {
                var id = p.cid + '-slide-' + (itm++);
                p.control.append('<li data-target="#' + p.cid + '" data-slide-to="' + (itm) + '" class="' + act + '"></li>')
                p.content.append(
                    '<div class="item' + act + '">' +
                    '<div class="carousel-item-container">' +
                    '<div id="' + id + '" class="row" style="padding: 0px 10px">'
                );
            }

            var rowId = p.cid + '-slide-' + (itm - 1);
            var cls = Math.floor(12 / p.steps);
            p.setTable(el, i, rowId, cls);
        });

        //$('.carousel#' + p.vid).carousel({interval : p.interval});

        me.proto = p;

        if (callback) {
            cb = callback;
            if (typeof callback == 'function') cb = callback(me.proto, me);
        } else {
            cb = me;
        }
        return cb
    };
    carousel.prototype.redrawCompare = carousel.prototype.redraw;

    /**
     * Normalize data
     * description : if not set "config.data" at first instance carousel class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    carousel.prototype.normalize = function (callback) {
        var me = this, cb;

        me.data = {};
        me.fields.forEach(function (field, i) {
            me.data[field] = [];
            me.rows.forEach(function (row, j) {
                if (row[i]) me.data[field].push(row[i])
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
    carousel.prototype.normalizeCompare = carousel.prototype.normalize;

    /**
     * Invoke a d3 class!
     * @param config
     * @returns {carousel}
     */
    d3.carousel = function (config) {
        return new carousel(config)
    };
})(d3);