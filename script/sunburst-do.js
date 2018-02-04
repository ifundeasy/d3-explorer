var menu = [
    {
        title: 'Item #1',
        action: function (elm, d, i) {
            console.log('Item #1 clicked!');
            console.log('The data for this circle is: ' + d);
        }
    },
    {
        title: 'Item #2',
        action: function (elm, d, i) {
            console.log('You have clicked the second item!');
            console.log('The data for this circle is: ' + d);
        }
    }
];
var data = {
    "text": "",
    "color": "#F4D500",
    "children": [
        {
            "text": "Perekonomian",
            "children": [
                {
                    "text": "Perindustrian",
                    "children": [
                        {
                            "text": "New Innova",
                            "key": "topic",
                            "size": 35
                        },
                        {
                            "text": "Toyota Grup",
                            "key": "topic",
                            "size": 347
                        },
                        {
                            "text": "Industri Mobil",
                            "key": "topic",
                            "size": 1859
                        },
                        {
                            "text": "TMMIN ",
                            "key": "topic",
                            "size": 50
                        },
                        {
                            "text": "Toyota (TAM)",
                            "key": "topic",
                            "size": 117
                        }
                    ],
                    "key": "text"
                },
                {
                    "text": "Keuangan",
                    "children": [
                        {
                            "text": "Investasi",
                            "key": "topic",
                            "size": 45
                        }
                    ],
                    "key": "text"
                },
                {
                    "text": "Ekonomi",
                    "children": [
                        {
                            "text": "RAPBN 2016",
                            "key": "topic",
                            "size": 29
                        },
                        {
                            "text": "Paket Kebijakan Ekonomi",
                            "key": "topic",
                            "size": 449
                        },
                        {
                            "text": "Saham",
                            "key": "topic",
                            "size": 2654
                        }
                    ],
                    "key": "text"
                },
                {
                    "text": "Lingkungan Hidup",
                    "children": [
                        {
                            "text": "Bencana Alam",
                            "key": "topic",
                            "size": 3430
                        }
                    ],
                    "key": "text"
                }
            ],
            "color": "#45AF94",
            "key": "parent"
        },
        {
            "text": "Politik",
            "children": [
                {
                    "text": "Pilkada",
                    "children": [
                        {
                            "text": "KPU",
                            "key": "topic",
                            "size": 2108
                        }
                    ],
                    "key": "text"
                },
                {
                    "text": "Pemerintah",
                    "children": [
                        {
                            "text": "Jokowi",
                            "key": "topic",
                            "size": 6705
                        },
                        {
                            "text": "Jokowi A",
                            "key": "topic",
                            "size": 6705
                        },
                        {
                            "text": "Kementrian",
                            "key": "topic",
                            "size": 11118
                        }
                    ],
                    "key": "text"
                }
            ],
            "color": "#FE8400",
            "key": "parent"
        },
        {
            "text": "Hankam",
            "children": [
                {
                    "text": "Hukum",
                    "children": [
                        {
                            "text": "Mahkamah",
                            "key": "topic",
                            "size": 16580
                        }
                    ],
                    "key": "text"
                }
            ],
            "color": "#E25669",
            "key": "parent"
        },
        {
            "text": "Politik Hukum dan Keamanan",
            "children": [
                {
                    "text": "Polhukam",
                    "children": [
                        {
                            "text": "BOM",
                            "key": "topic",
                            "size": 924
                        },
                        {
                            "text": "Pansus Asap",
                            "key": "topic",
                            "size": 9
                        },
                        {
                            "text": "Setya Novanto",
                            "key": "topic",
                            "size": 683
                        },
                        {
                            "text": "TNI",
                            "key": "topic",
                            "size": 3451
                        },
                        {
                            "text": "Impeachment",
                            "key": "topic",
                            "size": 131
                        },
                        {
                            "text": "Pansus Pelindo 2",
                            "key": "topic",
                            "size": 87
                        },
                        {
                            "text": "Polri",
                            "key": "topic",
                            "size": 12062
                        },
                        {
                            "text": "D",
                            "key": "topic",
                            "size": 7783
                        }
                    ],
                    "key": "text"
                },
                {
                    "text": "Dalam Negeri",
                    "children": [
                        {
                            "text": "Rupiah",
                            "key": "topic",
                            "size": 2169
                        }
                    ],
                    "key": "text"
                },
                {
                    "text": "Keamanan",
                    "children": [
                        {
                            "text": "ISIS",
                            "key": "topic",
                            "size": 1595
                        }
                    ],
                    "key": "text"
                }
            ],
            "color": "#5FBCCE",
            "key": "parent"
        },
        {
            "text": "Kemaritiman",
            "children": [
                {
                    "text": "Pariwisata",
                    "children": [
                        {
                            "text": "Phi Phi",
                            "key": "topic",
                            "size": 39
                        }
                    ],
                    "key": "text"
                }
            ],
            "color": "#0085B2",
            "key": "parent"
        }
    ]
};
var source = {
    fields: ['lvl0', 'lvl1', 'lvl2', 'size'],
    rows: [
        ["A1", "A11", "A111", (Math.random() * 1000)],
        ["A1", "A11", "A112", (Math.random() * 1000)],
        ["A1", "A11", "A113", (Math.random() * 1000)],
        ["A1", "A12", "A121", (Math.random() * 1000)],
        ["A1", "A12", "A122", (Math.random() * 1000)],
        ["A1", "A13", "A131", (Math.random() * 1000)],
        ["A2", "A21", "A211", (Math.random() * 1000)],
        ["A2", "A21", "A212", (Math.random() * 1000)],
        ["A2", "A21", "A213", (Math.random() * 1000)],
        ["A2", "A22", "A221", (Math.random() * 1000)],
        ["A2", "A22", "A222", (Math.random() * 1000)],
        ["A2", "A23", "A231", (Math.random() * 1000)],
        ["A3", "A31", "A311", (Math.random() * 1000)],
        ["A3", "A31", "A312", (Math.random() * 1000)],
        ["A3", "A31", "A313", (Math.random() * 1000)],
        ["A3", "A32", "A321", (Math.random() * 1000)],
        ["A3", "A32", "A322", (Math.random() * 1000)],
        ["A3", "A33", "A331", (Math.random() * 1000)],
    ]
};
var source = {
    fields: ["parent", "text", "topic", "other", "size"],
    rows: [
        [
            "Perekonomian",
            "Perindustrian",
            "New Innova",
            "{\"category\":\"Perekonomian\",\"name\":\"New Innova\",\"description\":\"New Kijang Innova\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(kijang AND innova AND new) OR (innova AND new)\",\"sub_category\":\"Perindustrian\",\"isEnable\":true}",
            35
        ],
        [
            "Perekonomian",
            "Keuangan",
            "Investasi",
            "{\"category\":\"Perekonomian\",\"name\":\"Investasi\",\"description\":\"Iinvestasi\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(investasi AND bodong) OR (investasi AND penipuan) OR (investasi AND abal)\",\"sub_category\":\"Keuangan\",\"isEnable\":true}",
            45
        ],
        [
            "Perekonomian",
            "Perindustrian",
            "Toyota Grup",
            "{\"category\":\"Perekonomian\",\"name\":\"Toyota Grup\",\"description\":\"Toyota Grup\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(toyota) AND (distribusi OR distributor OR revenue OR pendapatan OR kerugian OR laba OR rugi OR keuntungan OR tenaga OR pesaing OR kompetitor OR kapasitas OR produksi)  NOT rossi NOT adhie\",\"sub_category\":\"Perindustrian\",\"isEnable\":true}",
            347
        ],
        [
            "Perekonomian",
            "Ekonomi",
            "RAPBN 2016",
            "{\"category\":\"Perekonomian\",\"name\":\"RAPBN 2016\",\"description\":\"RAPBN 2016\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(rapbn AND 2016)\",\"sub_category\":\"Ekonomi\",\"compare\":[{\"color\":\"#00ff00\",\"description\":\"Pelindo Vs Asap\",\"name\":\"Pansus DPR\"}],\"isEnable\":true}",
            29
        ],
        [
            "Perekonomian",
            "Ekonomi",
            "Paket Kebijakan Ekonomi",
            "{\"category\":\"Perekonomian\",\"name\":\"Paket Kebijakan Ekonomi\",\"description\":\"Paket Kebijakan Ekonomi\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(paket AND kebijakan AND ekonomi)\",\"sub_category\":\"Ekonomi\",\"compare\":[{\"color\":\"#ff40ff\",\"description\":\"\",\"name\":\"Komper empat\"}],\"isEnable\":true}",
            449
        ],
        [
            "Politik",
            "Pilkada",
            "KPU",
            "{\"category\":\"Politik\",\"sub_category\":\"Pilkada\",\"name\":\"KPU\",\"description\":\"\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"pilkada OR kpu OR tps OR pps OR ppk\",\"compare\":[{\"color\":\"#008f00\",\"description\":\"\",\"name\":\"Komper empat\"}],\"isEnable\":true}",
            2108
        ],
        [
            "Hankam",
            "Hukum",
            "Mahkamah",
            "{\"category\":\"Hankam\",\"name\":\"Mahkamah\",\"description\":\"\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"hakim OR jaksa OR pengacara OR yudisial OR peradilan OR pengadilan OR ham\",\"sub_category\":\"Hukum\",\"compare\":[{\"color\":\"#42f8c5\",\"description\":\"\",\"name\":\"Komper lima\"},{\"color\":\"#ff9300\",\"description\":\"\",\"name\":\"Komper empat\"}],\"isEnable\":true}",
            16580
        ],
        [
            "Politik",
            "Pemerintah",
            "Jokowi",
            "{\"category\":\"Politik\",\"name\":\"Jokowi\",\"description\":\"\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"jokowi OR joko widodo\",\"sub_category\":\"Pemerintah\",\"compare\":[{\"color\":\"#91da05\",\"description\":\"Jokowi Kembaran\",\"name\":\"Jokowi\"}],\"isEnable\":true}",
            6705
        ],
        [
            "Politik",
            "Pemerintah",
            "Jokowi A",
            "{\"category\":\"Politik\",\"name\":\"Jokowi A\",\"description\":\"Jokowi A\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"jokowi OR joko widodo\",\"isEnable\":true,\"sub_category\":\"Pemerintah\",\"compare\":[{\"color\":\"#13a97a\",\"description\":\"Jokowi Kembaran\",\"name\":\"Jokowi\"}]}",
            6705
        ],
        [
            "Politik Hukum dan Keamanan",
            "Polhukam",
            "BOM",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"BOM\",\"description\":\"\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"sarinah tamrin\",\"sub_category\":\"Polhukam\",\"isEnable\":true}",
            924
        ],
        [
            "Perekonomian",
            "Perindustrian",
            "Industri Mobil",
            "{\"category\":\"Perekonomian\",\"name\":\"Industri Mobil\",\"description\":\"Industri Mobil\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"toyota OR honda OR nisan OR mitsubishi OR honda OR daihatsu OR suzuki OR kia OR bmw OR isuzu OR datsun NOT rossi NOT stoner NOT marquez NOT (baca juga) NOT alonso NOT cakar NOT espargaro NOT milan NOT sabu\",\"sub_category\":\"Perindustrian\",\"isEnable\":true}",
            1859
        ],
        [
            "Politik Hukum dan Keamanan",
            "Polhukam",
            "Pansus Asap",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"Pansus Asap\",\"description\":\"Pansus Asap\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(pansus AND asap) OR (pansus AND hutan) OR (pansus AND kebakaran) OR (pansus AND karhutla)\",\"sub_category\":\"Polhukam\",\"compare\":[{\"color\":\"#0000ff\",\"description\":\"Pelindo Vs Asap\",\"name\":\"Pansus DPR\"}],\"isEnable\":true}",
            9
        ],
        [
            "Perekonomian",
            "Perindustrian",
            "TMMIN ",
            "{\"category\":\"Perekonomian\",\"name\":\"TMMIN \",\"description\":\"Toyota Motor Manufacturing Indonesia\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(toyota AND motor AND manufacturing AND indonesia) OR (tmmin) \",\"sub_category\":\"Perindustrian\",\"isEnable\":true}",
            50
        ],
        [
            "Perekonomian",
            "Ekonomi",
            "Saham",
            "{\"category\":\"Perekonomian\",\"name\":\"Saham\",\"description\":\"Bursa Saham\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(bursa AND saham) OR (pasar AND modal) OR ihsg\",\"sub_category\":\"Ekonomi\",\"isEnable\":true}",
            2654
        ],
        [
            "Politik Hukum dan Keamanan",
            "Dalam Negeri",
            "Rupiah",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"sub_category\":\"Dalam Negeri\",\"name\":\"Rupiah\",\"description\":\"\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"rupiah\",\"compare\":[{\"color\":\"#71bef3\",\"description\":\"\",\"name\":\"Komper empat\"}],\"isEnable\":true}",
            2169
        ],
        [
            "Politik Hukum dan Keamanan",
            "Polhukam",
            "Setya Novanto",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"Setya Novanto\",\"description\":\"Ketua DPR RI\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(setya AND novanto)\",\"sub_category\":\"Polhukam\",\"isEnable\":true}",
            683
        ],
        [
            "Politik Hukum dan Keamanan",
            "Keamanan",
            "ISIS",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"ISIS\",\"description\":\"Islamic State\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"isis OR niis\",\"sub_category\":\"Keamanan\",\"compare\":[],\"isEnable\":true}",
            1595
        ],
        [
            "Politik Hukum dan Keamanan",
            "Polhukam",
            "TNI",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"TNI\",\"description\":\"TNI\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"tni OR kodim OR kodam OR korem OR koramil OR babinsa\",\"sub_category\":\"Polhukam\",\"compare\":[{\"color\":\"#755ee1\",\"description\":\"\",\"name\":\"Komper lima\"}],\"isEnable\":true}",
            3451
        ],
        [
            "Perekonomian",
            "Lingkungan Hidup",
            "Bencana Alam",
            "{\"category\":\"Perekonomian\",\"name\":\"Bencana Alam\",\"description\":\"Bencana Alam\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"kekeringan OR (krisis AND air) OR (kelangkaan AND air) OR erupsi OR (asap AND kebakaran) OR (asap AND hutan) OR (kebakaran AND lahan) OR (kebakaran AND hutan) OR (lahan AND terbakar) OR gempa OR banjir\",\"sub_category\":\"Lingkungan Hidup\",\"isEnable\":true}",
            3430
        ],
        [
            "Perekonomian",
            "Perindustrian",
            "Toyota (TAM)",
            "{\"category\":\"Perekonomian\",\"name\":\"Toyota (TAM)\",\"description\":\"Toyota Astra Motor\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(toyota AND astra AND motor)\",\"sub_category\":\"Perindustrian\",\"isEnable\":true}",
            117
        ],
        [
            "Politik",
            "Pemerintah",
            "Kementrian",
            "{\"category\":\"Politik\",\"sub_category\":\"Pemerintah\",\"name\":\"Kementrian\",\"description\":\"\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"menteri OR  menko\",\"isEnable\":true}",
            11118
        ],
        [
            "Politik Hukum dan Keamanan",
            "Polhukam",
            "Impeachment",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"Impeachment\",\"description\":\"Opini Impeachment \",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(lengser AND jokowi) OR (jokowi AND turunkan AND demo) OR (gulingkan AND jokowi) OR (jokowi AND makzulkan) OR (pemakzulan AND Jokowi) OR (jokowi AND impeach) OR (jokowi AND kudeta) OR (jokowi AND mundur)\",\"sub_category\":\"Polhukam\",\"isEnable\":true}",
            131
        ],
        [
            "Politik Hukum dan Keamanan",
            "Polhukam",
            "Pansus Pelindo 2",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"Pansus Pelindo 2\",\"description\":\"Pansus Pelindo\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(pansus AND pelindo)\",\"sub_category\":\"Polhukam\",\"compare\":[{\"color\":\"#ff0000\",\"description\":\"Pelindo Vs Asap\",\"name\":\"Pansus DPR\"}],\"isEnable\":true}",
            87
        ],
        [
            "Politik Hukum dan Keamanan",
            "Polhukam",
            "Polri",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"Polri\",\"description\":\"Polri\",\"media\":[\"beritasatu\",\"detik\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"polri OR polsek OR polres OR reskrim OR brimob OR lantas OR reskrim OR densus OR (divhumas AND polri) OR (humas OR polri)\",\"sub_category\":\"Polhukam\",\"isEnable\":true}",
            12062
        ],
        [
            "Kemaritiman",
            "Pariwisata",
            "Phi Phi",
            "{\"category\":\"Kemaritiman\",\"name\":\"Phi Phi\",\"description\":\"Wisata Phi Phi\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"antaranews\",\"bisnis\",\"cnnindonesia\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"sindonews\",\"suarapembaruan\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"viva\"],\"keywords\":\"(phi AND phi)\",\"sub_category\":\"Pariwisata\",\"isEnable\":true}",
            39
        ],
        [
            "Politik Hukum dan Keamanan",
            "Polhukam",
            "D",
            "{\"category\":\"Politik Hukum dan Keamanan\",\"name\":\"D\",\"description\":\"\",\"media\":[\"beritasatu\",\"detik\",\"metrotvnews\",\"okezone\",\"analisadaily\",\"antaranews\",\"bareksa\",\"bisnis\",\"cnnindonesia\",\"foxnews\",\"indopos\",\"inilah\",\"investor\",\"jpnn\",\"kompas\",\"liputan6\",\"merdeka\",\"portalkbr\",\"poskota\",\"rakyatmerdeka\",\"republika\",\"rimanews\",\"sindonews\",\"suarapembaruan\",\"telegraph\",\"tempo\",\"teropongsenayan\",\"tribunnews\",\"usatoday\",\"viva\"],\"keywords\":\"'partai demokrat'\",\"isEnable\":true,\"sub_category\":\"Polhukam\"}",
            7783
        ]
    ]
};
/**
 * d3.sunburst({})
 * description : class dengan (wajib) parameter objek guna configurasi awal
 * return value : this (sunburst instance) --> reuseable for chaining :D
 * dependencies : JQuery, d3.apply;
 * methods :
 *      .normalize() : return sunburst instance
 *      .normalize(callback) : callback(data, sunburst) { ... }
 *      .redraw() : return sunburst instance
 *      .redraw(callback) : callback(d3_proto, sunburst) { ... }
 *
 */
var sb = d3.sunburst({
    parent: '#sunburst-page',
    fields: source.fields,
    rows: source.rows,
    //data  : data,
    sort: false,
    showRoot: true,
    gradation: 0.3,
    delay: 1000,
    fontSize: 10,
    preprocess: function (me) {
        me.rows = me.rows.map(function (row) {
            return [row[0], row[1], row[2], row[4], row[3]]
        })
    },
    events: {
        contextmenu: function (el, p, sunburst) {
            p.drilldown(el[0]);
        },
        mouseover: function (el, proto, sunburst) {
            console.log('mouseover', arguments)
        },
        click: d3.contextMenu(menu, function () {
            console.log('Quick! Before the menu appears!');
        })
    }
})
.normalize()
.redraw(function () {
    console.log(arguments)
});