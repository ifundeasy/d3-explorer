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
var source = {
    fields: ["title", "date", "sinopsis", "logo", "logo", "sentiment", "url"],
    rows: [
        [
            "Politikus Demokrat Siap Tantang Airin di Pilkada Tangsel",
            "2015-06-22",
            "\"REPUBLIKA.CO.ID, JAKARTA -- Politikus Partai Demokrat Ivan Ajie Purwanto siap bersaing di Pilkada Tangerang Selatan (Tangsel) pada akhir tahun ini. Dia menyatakan, komunikasi politik dengan para elite partai, baik di tingkat kabupaten, provinsi, maupun nasional terus dilakukan.\"",
            "republika.co.id",
            "republika.co.id",
            "Neutral",
            "http://facebook.com"
        ],
        [
            "Politikus Demokrat Siap Tantang Airin di Pilkada Tangsel",
            "2015-06-22",
            "Politikus Partai Demokrat Ivan Ajie Purwanto siap bersaing di Pilkada Tangerang Selatan (Tangsel) pada akhir tahun ini",
            "republika.com",
            "republika.com",
            "Neutral",
            "http://facebook.com"
        ],
        [
            "Wali Kota Tangsel Bukber dengan Warga",
            "2015-06-22",
            "\"TANGERANG SELATAN-Untuk menjalin silaturahmi dengan warganya selama bulan suci Ramadhan, Wali Kota Tangerang Selatan mengagendakan buka puasa dan shalat tarawih keliling (tarling) di masjid-masjid. \"",
            "tangerangnews.com",
            "tangerangnews.com",
            "Positive",
            "http://facebook.com"
        ],
        [
            "Wali Kota Tangsel Bukber dengan Warga",
            "2015-06-22",
            "\"Untuk menjalin silaturahmi dengan warganya selama bulan suci Ramadhan, Wali Kota Tangerang Selatan mengagendakan buka puasa dan shalat tarawih keliling (tarling) di masjid-masjid.\"",
            "tangerangnews.com",
            "tangerangnews.com",
            "Neutral",
            "http://facebook.com"
        ],
        [
            "Si Cantik Airin Wawancarai JK, Ini Materi Pertanyaan yang Diajukan",
            "2015-06-20",
            "\"BIASANYA, Wali Kota Tangerang Selatan (Tangsel) Airin Rachmi Diany diburu wartawan untuk diwawancarai. Namun, kini perempuan cantik kelahiran Banjar, Jawa Barat, 28 Agustus 1976, itu mewawancarai.\"",
            "jpnn.com",
            "jpnn.com",
            "Neutral",
            "http://facebook.com"
        ],
        [
            "Siap Maju Pilkada, Walikota Airin Tunggu Hasil Islah Golkar",
            "2015-06-20",
            "",
            "liputan6.com",
            "liputan6.com",
            "Positive",
            "http://facebook.com"
        ],
        [
            "Airin Tunggu Golkar Islah Sebelum Calonkan Diri Lagi di Pilkada Tangsel",
            "2015-06-19",
            "\"JAKARTA, KOMPAS.com - Wali Kota Tangerang Selatan Airin Rachmi Diany menunggu hasil islah dua kubu Partai Golkar sebelum memutuskan mencalonkan diri sebagai wali kota melalui partai tersebut. Airin berharap dua kubu Golkar bisa mencapai kesamaan sehingga partai berlambang beringin itu dapat mengusungnya kembali dalam pemilihan kepala daerah.\"",
            "kompas.com",
            "kompas.com",
            "Positive",
            "http://facebook.com"
        ],
        [
            "Sebelum Maju Pilkada Tangsel, Airin Tunggu Islah Golkar",
            "2015-06-19",
            "\"REPUBLIKA.CO.ID, JAKARTA -- Wali Kota Tangeran Selatan Airin Rachmi Diany menyatakan akan menunggu hasil islah kedua kubu Partai Golkar yang saat ini masih berkonflik sebelum mencalonkan diri sebagai wali kota. Ia pun berharap kedua kubu Partai Golkar tersebut dapat segera islah demi keikutsertaan partai tersebut dalam pilkada.\"",
            "republika.co.id",
            "republika.co.id",
            "Neutral",
            "http://facebook.com"
        ],
        [
            "Kasus TPPU Wawan, petinggi PT Cakrawala Automotif Rabhasa diperiksa",
            "2015-06-15",
            "\"Merdeka.com - Komisi Pemberantasan Korupsi (KPK) terus mengusut dugaan Tindak Pidana Pencucian Uang (TPPU) yang menjerat Tubagus Chaeri Wardana alias Wawan. Kali ini, penyidik memeriksa HRGA Manager PT Cakrawala Automotif Rabhasa, Deny Suherman.\"",
            "merdeka.com",
            "merdeka.com",
            "Negative",
            "http://facebook.com"
        ],
        [
            "Mitsubishi Semakin Dekat dengan Konsumen di Tangsel",
            "2015-06-15",
            "PT Krama Yudha Tiga Berlian Motors (KTB) melirik Tangerang Selatan (Tangsel) sebagai kawasan hunian dan bisnis yang potensial",
            "kompas.com",
            "kompas.com",
            "Neutral",
            "http://facebook.com"
        ]
    ]
};

/**
 * d3.timeline({})
 * description : class dengan (wajib) parameter objek guna configurasi awal
 * return value : this (timeline instance) --> reuseable for chaining :D
 * dependencies : JQuery, d3.apply;
 * methods :
 *      .normalize() : return timeline instance
 *      .normalize(callback) : callback(data, timeline) { ... }
 *      .redraw() : return timeline instance
 *      .redraw(callback) : callback(d3_proto, timeline) { ... }
 *
 */
var timeline = d3.timeline({
    parent: '#timeline-page',
    events: { //ga akan nge-fek, belum gw invoke ke class
        click: function (el, proto, timeline) {
            console.log('click', arguments)
        },
        mouseover: function (el, proto, timeline) {
            console.log('mouseover', arguments)
        },
        contextmenu: d3.contextMenu(menu, function () {
            console.log('Quick! Before the menu appears!');
        })
    }
});

d3.apply(timeline, source); //add-field, add-row
timeline
.normalize()
.redraw(function () {
    console.log(arguments)
});