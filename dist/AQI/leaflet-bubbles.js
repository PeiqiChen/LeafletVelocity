var BubblesOverlay = L.Layer.extend({

    /**
     *
     * @param {nums:Int, colors:Array,fontSize,fontColor,png:String} config
     */
    initialize: function (config) {
        this.layerType="bubbleLayer";
        this.myGroup = [];
        this.layers = [];
        this.cfg = config;
        this.data = [];
        if (this.cfg.nums != this.cfg.colors.length) {
            throw Error('The length of icons is not equal to the numbers of your grade')
        }
    },

    onAdd: function (map) {
        this._map = map;
        // 一开始画数据
        this._draw(this.data);
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    onRemove: function (map) {
        // 将数据清空
        this.layers = [];
        this.myGroup.clearLayers();
        var oImg = document.getElementById("AQI_img");
        oImg.remove();
    },

    _draw: function (data) {
        if (data.length != this.cfg.nums) {
            throw Error('The types of your data is not equal to the types of color')
        }
        // 根据坐标和值画图
        for (var i = 0; i < data.length; i++) {
            var data_one = data[i];// 取每一种data
            var mycolor = this.cfg.colors[i] // 这种data对应的icon
            for (var j = 0; j < data_one.length; j++) {
                mydata = data_one[j];
                latlng = [];
                latlng.push(mydata.lat);
                latlng.push(mydata.lon);
                // 文字标记
                var myIcon = L.divIcon({
                    html: mydata.num,
                    className: 'my-div-icon',
                    iconSize: 0
                });
                var txtMarker = new L.marker(latlng, { icon: myIcon });
                this.layers.push(txtMarker);

                // 圆圈标记
                var circleMarker = new L.circle([51.5, -0.09], {
                    color: mycolor,
                    fillOpacity: 0.5,
                    radius: 10000
                });
                circleMarker.setLatLng(latlng)
                this.layers.push(circleMarker);
            }
        }
        this.myGroup = L.layerGroup(this.layers);
        this._map.addLayer(this.myGroup);
        var elements = document.getElementsByClassName("my-div-icon");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.fontSize = this.cfg.fontSize;
            elements[i].style.color = this.cfg.fontColor;
        }
        //追加
        var map = document.getElementById('map');
        //创建li和img
        // var oLi = document.createElement('li');
        var oImg = document.createElement('img');
        oImg.src = this.cfg.src;
        oImg.id = 'AQI_img'
        oImg.style = "z-index:999;position: fixed;right:26px;bottom:15px"
        oImg.style.width = "20%"
        oImg.style.height = "8%"
        //将img插入li中
        // oLi.appendChild(oImg);
        //将li插入到ul中
        map.appendChild(oImg);
    },

    /**
     * 设置数据
     * @param {数据} data
     */
    setData: function (data) {
        this.data = data;
    },

    /**
     * 添加数据
     * @param {数据} data
     */
    addData: function (data) {
        this.data.push(data);
        this._draw(data);
    },
    /**
     * 更新数据
     * @param {数据} data
     */
    resetData: function(data){
        this.layers = [];
        this.myGroup.clearLayers();
        this.setData(data);
        this._draw(data);
    }
});
