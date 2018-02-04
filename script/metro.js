(function (d3) {
    /**
     * Metro instance
     * @param config : typeof Object
     * @returns {metro}
     */
    var metro = function (config) {
        d3.apply(this, config);
        this.events = this.events || {};
        return this;
    };
    /**
     * Redraw chart
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    metro.prototype.redraw = function (callback) {
        var me = this, cb;
        var p = {
            parent: me.parent
        };

        p.width = $(p.parent).width();
        p.height = $(p.parent).height();

        $(p.parent).html('');

        if (!$(p.parent).attr('id')) $(p.parent).attr('id', (new Date().getTime()).toString(32));

        p.vid = $(p.parent).attr('id');
        //Draw Tab
        var stat = '';
        var html = [
            '<ul class="nav nav-tabs nav-tabs-fillup" id="tabindex">'
        ];
        //var listTabs = [{"key" : "issue"}, {"key" : "person"}, {"key" : "organization"}, {"key" : "media"}]
        var listTabs = []
        for (var key in me.data) {
            listTabs.push({"key": key})
            html.push('<li class="list-tabs " id="tabindex-' + key + '">',
                '<a data-toggle="tab" href="#' + key + '"><span>' + key + '</span></a>',
                '</li>');
        }
        ;
        html.push('</ul>');
        html.push('<div class="tab-content no-padding bg-transparent" id="metroTabContent">');
        html.push('</div>');
        $(p.parent).append(html.join('\n'));
        //Draw Pane
        var html = [];
        for (var key in me.data) {
            html.push(
                '<div class="tab-pane slide-left " id="' + key + '">',
                '<div class="row">',
                '<div class="col-md-12">',
                '<div class="ar-1-1">',
                '<div class="widget-7 panel no-border bg-transparent no-margin relative auto-overflow">',
                '<div class="panel-body no-padding">',
                '<div class="metro live-tile " data-delay="3500" data-mode="carousel">',
                '<div class="slide-front tiles slide active ">',
                '<div class="panel-heading top-right no-margin no-padding">',
                '<div class="panel-controls">',
                '<ul>',
                '<li><img src="assets/img/thisweek.png" alt="" data-src="assets/img/thisweek.png"',
                'data-src-retina="assets/img/thisweek.png" width="72" height="72">',
                '</li>',
                '</ul>',
                '</div>',
                '</div>',
                '<div class="panel-body no-padding">',
                '<div class="p-b-5 p-r-20 p-t-10">',
                '<table class="table table-condensed table-hover text-black">',
                '<tbody id="' + key + '-thisweek">',
                '</tbody>',
                '</table>',
                '</div>',
                '</div>',
                '</div>',
                '<div class="slide-back tiles ">',
                '<div class="panel-heading top-right no-margin no-padding">',
                '<div class="panel-controls">',
                '<ul>',
                '<li><img src="assets/img/lastweek.png" alt="" data-src="assets/img/lastweek.png"',
                'data-src-retina="assets/img/lastweek.png" width="72" height="72">',
                '</li>',
                '</ul>',
                '</div>',
                '</div>',
                '<div class="panel-body no-padding">',
                '<div class="p-b-5 p-r-20 p-t-10">',
                '<table class="table table-condensed table-hover text-black">',
                '<tbody id="' + key + '-lastweek">',
                '</tbody>',
                '</table>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>');
            $('#metroTabContent').append(html.join('\n'));
            htmlTw = [];
            htmlLw = [];
            for (var i = 0; i < me.data[key].length; i++) {
                if (me.data[key][i].type == 'tw') {
                    htmlTw.push('<tr>',
                        '<td width="65%" class="font-montserrat all-caps fs-12">' + me.data[key][i].col + '</td>',
                        '<td width="20%" class="text-right b-r b-dashed b-grey">',
                        '<span class="hint-text small">' + me.data[key][i].value + '</span>',
                        '</td>',
                        '<td width="15%" class="text-center">',
                        '<span><i class="fa fa-arrow-up text-success"></i></span>',
                        '</td>',
                        '</tr>');
                }
                else {
                    htmlLw.push('<tr>',
                        '<td width="65%" class="font-montserrat all-caps fs-12">' + me.data[key][i].col + '</td>',
                        '<td width="20%" class="text-right b-r b-dashed b-grey">',
                        '<span class="hint-text small">' + me.data[key][i].value + '</span>',
                        '</td>',
                        '<td width="15%" class="text-center">',
                        '<span><i class="fa fa-arrow-down text-success"></i></span>',
                        '</td>',
                        '</tr>');
                }
            }
            ;
            $('#' + key + '-lastweek').append(htmlLw.join('\n'));
            $('#' + key + '-thisweek').append(htmlTw.join('\n'));
        }
        ;
        var z = undefined;
        var a = 1;
        $(".metro").liveTile();
        $('#tabindex a[href="#' + listTabs[0].key + '"]').tab('show')

        z = setInterval(function () {
            $('#tabindex a[href="#' + listTabs[a].key + '"]').tab('show');
            //Ordering Tabs
            if (a == 3) {
                a = 0;
            }
            else
                a++;
            //Clearing interval when user click tabs
            $('.list-tabs').on('click', function () {
                //console.log('clear')
                clearInterval(z);
            })

        }, 6000);

        //me.data.forEach(p.setTemplate);
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
     * description : if not set "config.data" at first instance timeline class but you have config.fields and config.rows
     * @param callback : typeof Function (optional)
     * @returns {*}
     */
    metro.prototype.normalize = function (callback) {
        var me = this, cb;
        me.data = {};
        me.data[me.rows[0][1]] = [];
        for (var i = 0; i < me.rows.length; i++) {
            if (me.data[me.rows[i][1]]) {
                me.data[me.rows[i][1]].push({
                    'type': me.rows[i][0],
                    'col': me.rows[i][2],
                    'value': me.rows[i][3]
                })
            }
            else {
                me.data[me.rows[i][1]] = [];
                me.data[me.rows[i][1]].push({
                    'type': me.rows[i][0],
                    'col': me.rows[i][2],
                    'value': me.rows[i][3]
                });
            }

        }
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
     * @returns {timeline}
     */
    d3.metro = function (config) {
        return new metro(config)
    };
})(d3);