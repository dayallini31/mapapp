var cqlquery = Class.create({

    init: function (Constructor) {
        this.Constructor = Constructor;

        jQuery.pubsub.subscribe('layers.added', $.proxy(function (topic, msg) {           
            $('#' + this.Constructor.layersQueryList).append('<label id="_' + msg.layer + '_"><input type="radio" value="' + msg.layer + '" name="layerQuery">' + msg.id + '</label>');
        }, this));

        jQuery.pubsub.subscribe('layers.removed', $.proxy(function (topic, msg) {
            $('#_' + msg.layer + '_').remove();
        }, this));

    },

    click: function (p) {
       
        var layr = app.CustomLayerHandler.Constructor.appLayers.map($.proxy(function (v) {
            if (v.name == $("#layersQueryList input[type='radio']:checked").val()) { return v; }
        }, this)).filter(function (element) { return element !== undefined; })[0];        
        layr.lyr.getSource().updateParams({"CQL_FILTER": p}); 

    }
});
