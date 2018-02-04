// Constructor for DataSource objects
window.FdsSource = function (options) {
    var me = this;
    return me.init(options);
};

FdsSource.prototype = {
    init: function (options) {
        var me = this;

        me.url = options.url || "/pqs/fdsQuery";
        me.q = options.q || "";
        me.header = options.header || "";
        me.quid = options.quid || "";
        me.sourceList = [];
        me.source = {};
        me.rows = [];
        me.head = [];

        me.listeners = {
            source: [],
            head: [],
            data: [],
            error: [],
            open: [],
            close: [],
            force: [],
            explain: [],
            quid: [],
            endstream: [],
            complete: [],
            trace: []
        };

        me.listeners.head[0];
        me.listeners['head'];
    },
    on: function (event, callback) {
        var me = this;
        if (me.listeners[event] != undefined) {
            me.listeners[event].push(callback);
        }
    },
    query: function (visual, callback) {
        var me = this;
        var data = {
            page: App.page,
            q: me.q
        };
        jQuery.ajax({
            url: '/pqs/fdsQuery',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function (result) {
                if (result.status == 'ok') {
                    visual.fields = [];
                    visual.total = result.total;
                    for (var i = 0; i < result.fields.length; i++) {
                        visual.fields.push(result.fields[i]);
                    }
                    ;
                    visual.rows = [];

                    for (var i = 0; i < result.rows.length; i++) {
                        visual.rows.push(result.rows[i]);
                    }

                    console.info(visual);

                    if ((!App.route) || (App.route && (App.Storage.get('type') == 'topic'))) {
                        visual.normalize();
                        visual.redraw(function () {
                            //
                        });
                    }
                    if (App.route && (App.Storage.get('type') == 'compare')) {
                        visual.normalizeCompare();
                        visual.redrawCompare(function () {
                            //
                        })
                    }
                    if (callback && (typeof callback == 'function')) callback(visual)
                }

            },
            //async: false
        });
        /*var me = this;
        var uri = me.q + '&header=' + me.header;
        var source = new EventSource(window.location.origin + me.url + '?' + encodeURI(uri));
        var listener = {
            message : function (e) {
                var msg = JSON.parse(e.data);
                var lng = me.listeners[msg.event].length;
                for (var i = 0; i < lng; i++) {
                    //console.info(me.q, 'on', msg.event);
                    me.listeners[msg.event][i](msg);
                }

                if (msg.e == 'close' || msg.e == 'error'|| msg.e == 'complete') {
                    source.close();
                }
            },
            open : function (e) {
                var length = me.listeners.open.length;
                for (var i = 0; i < length; i++) {
                    me.listeners.open[i]();
                }
            },
            error : function (e) {
                if (e.eventPhase == 2) { //EventSource.CLOSED
                    var length = me.listeners.open.length;
                    for (var i = 0; i < length; i++) {
                        me.listeners.close[i]();
                    }
                }
                source.close();
            }
        };
        source.addEventListener('message', listener.message, false);
        source.addEventListener('open', listener.open, false);
        source.addEventListener('error', listener.error, false);*/
    },
    setDataSource: function (visual) {
        var me = this;
        var event = {
            source: function (msg) {
                me.sourceList.push(msg.source);
                me.source[msg.source] = {header: [], data: []};
            },
            head: function (msg) {
                visual.fields = visual.fields || [];
                for (var i = 0; i < msg.fields.length; i++) {
                    visual.fields.push(msg.fields[i]);
                }
            },
            data: function (msg) {
                visual.rows = visual.rows || [];
                for (var i = 0; i < msg.rows.length; i++) {
                    visual.rows.push(msg.rows[i]);
                }
            },
            trace: function (msg) {
                //
            },
            error: function (msg) {
                //
            },
            close: function (msg) {
                //
            },
            complete: function (msg) {
                if ((!App.route) || (App.route && (App.Storage.get('type') == 'topic'))) {
                    visual.normalize();
                    visual.redraw(function () {
                        //
                    });
                }
                if (App.route && (App.Storage.get('type') == 'compare')) {
                    visual.normalizeCompare();
                    visual.redrawCompare(function () {
                        //
                    })
                }
            }
        };

        me.on('source', event.source);
        me.on('head', event.head);
        me.on('data', event.data);
        me.on('trace', event.trace);
        me.on('error', event.error);
        me.on('close', event.close);
        me.on('complete', event.complete);
    }
};