var vector = Class.create({

    init: function (Constructor) {
        this.Constructor = Constructor;
    },
    populateDropdownData: function ()
    {
        $.ajax({
            url: "../intern/data/ref.json",
            success: $.proxy(function (data) {
                this.configdata = data;
                var content = "";
                for (var i = 0; i < this.configdata.datasource.length; i++) {
                    content = content + '<option value="' + this.configdata.datasource[i].id + '">' + this.configdata.datasource[i].name + '</option>';
                }
                $('#' + this.Constructor.dropdownBind).html(content);
                this.createDataArray();
            }, this)
        });
    },
    createDataArray: function ()
    {
        for (var i = 0; i < this.configdata.datasource.length; i++) {
            switch (this.configdata.datasource[i].type) {
                case "JSON": this.jsonDataHandler(this.configdata.datasource[i]);
                    break;
                case "WMS": this.wmsDataHandler(this.configdata.datasource[i]);
                    break;
            }
        }
    },
    jsonDataHandler: function (obj)
    {
        $.ajax({
            url: "../intern/data/" + obj['config']['source'],
            success: $.proxy(function (response) {
                var e = {
                    name: obj.id,
                    type: 'JSON',
                    lyr: new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: (new ol.format.GeoJSON()).readFeatures(response, {
                                dataProjection: new ol.proj.Projection({ code: "EPSG:4326" }),
                                featureProjection: new ol.proj.Projection({ code: "EPSG:3857" })
                            })
                        })
                    })
                };
                this.Constructor['appLayers'].push(e);
            }, this)
        });
    },
    wmsDataHandler: function (obj)
    {
        var e = {
            name: obj.id,
            type: 'WMS',
            lyr: new ol.layer.Tile({
                source: new ol.source.TileWMS(obj.config)
            })
        };
        this.Constructor['appLayers'].push(e);
    },
    addDataHandler: function ()
    {
        var selected = $('#' + this.Constructor.dropdownBind).val();         
        for (var j = 0; j < this.Constructor['appLayers'].length; j++) {
            if (selected == this.Constructor.appLayers[j].name)
            {
                this.Constructor['appLayers'][j].lyr.set('name', this.Constructor['appLayers'][j].name);
                this.Constructor['appLayers'][j].lyr.set('type', this.Constructor['appLayers'][j].type);
                this.Constructor.map.addLayer(this.Constructor['appLayers'][j].lyr);


                var id = this.configdata.datasource.map($.proxy(function (v) {
                    if (v.id == this.Constructor.appLayers[j].name) { return v.name; }                    
                },this));
                jQuery.pubsub.publish('layers.added', {
                    "layer": this.Constructor.appLayers[j].name,
                    "id": id.filter(function (element) { return element !== undefined; })[0]
                });
            }
        }

       

    },
    clearDataHandler: function ()
    {
        var selected = $('#' + this.Constructor.dropdownBind).val();
        for (var j = 0; j < this.Constructor['appLayers'].length; j++)
        {
            if (selected == this.Constructor.appLayers[j].name)
            {
                this.Constructor.map.removeLayer(this.Constructor['appLayers'][j].lyr);
                jQuery.pubsub.publish('layers.removed', {
                    "layer": this.Constructor.appLayers[j].name
                });
            }
        }
    }

});
