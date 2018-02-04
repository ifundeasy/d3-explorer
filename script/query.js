function Query(config) {
    this.ip = config.ip || '192.168.0.89';
    this.path = config.path || '/pqs/sendQuery';
    this.port = config.port || '8110';
    this.method = '';
    this.q = config.q || '';
    this.quid = '';
    this.errMsg = {};
    this.user = config.user;
    this.portfiltered = '';
};

Query.prototype.send = function () {
    var meQuery = this;
    var data = {
        "page": App.page || 'news',
        "query": this.q,
        "user": this.user
    };

    jQuery.ajax({
        url: meQuery.path,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (result) {
            //console.log(result);
            if (typeof(result.status.body.quid) != 'undefined') {
                meQuery.quid = result.status.body.quid;
                //console.log(result.explain.body.nodePorts.filtered)
                meQuery.portfiltered = '';//result.explain.body.nodePorts.filtered;
                //console.log(query.explain.body.quid)
            }
            else {
                meQuery.errMsg = result;
            }
        },
        async: false
    });
};
