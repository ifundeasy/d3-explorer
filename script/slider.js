var Slider = function (obj) {
    var p = $(obj.parent).get(0);

    p.events = obj.events || {};
    p.data = obj.data || {};
    noUiSlider.create(p, {
        step: 1,
        start: obj.start,
        //limit: obj.limit,
        connect: "lower",
        direction: 'ltr',
        //behaviour: 'none',
        range: {
            'min': obj.min,
            'max': obj.max
        }
    });

    p.handle = $(p).find('.noUi-handle');
    p.tooltip = $('<div class="tooltip-noUiSlider">');
    p.handle.append(p.tooltip);
    p.noUiSlider.on('update', function (v) {
        var val = parseFloat(v);
        var raw = p.data[val] || {};
        var label = raw.label || val;
        p.tooltip.html(label);
    });
    p.noUiSlider.on('change', function (d, h, v) {
        var cb;
        if (p.events.change) {
            var val = parseFloat(v);
            var raw = p.data[val] || {};
            typeof p.events.change == 'function' ? cb = p.events.change(raw, p) : cb = p.events.change;
        }
        return cb
    });
    p.noUiSlider.on('update', function (d, h, v) {
        var cb;
        if (p.events.update) {
            var val = parseFloat(v);
            var raw = p.data[val] || {};
            typeof p.events.update == 'function' ? cb = p.events.update(raw, p) : cb = p.events.update;
        }
        return cb
    });

    return p;
};