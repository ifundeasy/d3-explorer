d3.paquesColor = d3.paquesColor || [
        '#FE8400', '#E25669', '#F4D500', '#45AF94', '#5FBCCE', '#0085B2',
        '#BFBFFF', '#886FC9', '#DC73FF', '#73B9FF', '#A2BF23', '#FED8AF',
        '#FAA5BA', '#FFE750', '#4EC5A3', '#63C8DE', '#0091C7', '#D6E1FF',
        '#A785FA', '#FDBBFF', '#C0E67C', '#FFB973', '#FF8544', '#FF6154',
        '#FFC566', '#A6CC35', '#2997C1', '#91C3FF', '#A83AA3', '#SC1378'
    ];
d3.paquesColor.random = d3.paquesColor.random || function () {
        var colors = d3.paquesColor;
        var r = Math.round(Math.random() * 10 * colors.length);

        if (r < colors.length && r >= 0) return colors[r];

        return d3.paquesColor.random(colors)
    };
d3.enumerables = d3.enumerables || [
        'hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
        'toLocaleString', 'toString', 'constructor'
    ];
d3.apply = d3.apply || function (object, config, defaults) {
        if (defaults) {
            d3.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (d3.enumerables) {
                for (j = d3.enumerables.length; j--;) {
                    k = d3.enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };