var clickEvnt = Class.create({

    init: function (Constructor) {
        this.Constructor = Constructor;

        this.popup = new ol.Overlay.Popup();
        this.Constructor.map.addOverlay(this.popup);


        this.Constructor['map'].on("click", $.proxy(function (evt) {
            if (app.googleStreet.Constructor.isEnabled) {
                jQuery.pubsub.publish('click.googleStreet', {
                    "evt": evt                    
                });

            } else {
                this.clickEvent(evt);
            }
        }, this));
    },

    clickEvent: function (evt)
    {
        this.ref = app.CustomLayerHandler.configdata;
        this.addedContent = '<ul class="nav nav-tabs">';
        this.coordinate = evt.coordinate;
        this.k = 0;
        this.itr = true; // active class 

        this.Constructor['map'].forEachLayerAtPixel(evt.pixel, function (layer, pixel) {
            for (var i = 0; i < this.ref.datasource.length; i++)
            {
                if (layer.get('name') == this.ref.datasource[i].id)
                {
                    if(this.k=0)
                        this.addedContent += '<li class="active"><a data-toggle="tab" href="' + '#' + this.ref.datasource[i].name + '"' + '>' + this.ref.datasource[i].name + '</a></li>';
                    else 
                        this.addedContent += '<li><a data-toggle="tab" href="' + '#' + this.ref.datasource[i].name + '"' + '>' + this.ref.datasource[i].name + '</a></li>';
                    this.k+=1;
                }
            }
            
        }, this);
        this.addedContent += '</ul><div class="tab-content">';
        this.Constructor['map'].forEachLayerAtPixel(evt.pixel, function (layer, pixel) {
            this.pixel = evt.pixel;           
            switch (layer.get('type')) {
                case "JSON":
                    this.jsonlayerCallback(layer);
                    break;
                case 'WMS':
                    this.wmslayerCallback(layer);
                    break;
                default:
                    console.log('default');
            }
        }, this);
          
        this.addedContent += '</div>';
        this.popup.show(this.coordinate, this.addedContent);
        $(".nav-tabs a").click(function () {
            $(this).tab('show');
        });
    },
    jsonlayerCallback: function (lyr)
    {
        var feature = lyr.getSource().getFeaturesAtCoordinate(this.coordinate);
        var aa = lyr.getSource().getClosestFeatureToCoordinate(this.coordinate);
        
        for (var i = 0; i < this.ref.datasource.length;)
        {
            if (lyr.get('name') == this.ref.datasource[i].id) {
                if (this.itr) {
                    this.addedContent += '<div id="' + this.ref.datasource[i].name + '" class="tab-pane fade in active">';
                    this.itr = false;
                } else { this.addedContent += '<div id="' + this.ref.datasource[i].name + '" class="tab-pane fade">'; }
                  for (var j = 0; j < this.ref.datasource[i].attri.length; j++)
                    {
                        var attribute = this.ref.datasource[i].attri[j];
                        if(feature[0])
                            var str = feature[0].O[attribute];
                        else
                            var str = aa.O[attribute];
                        this.addedContent +=attribute + ':' + str + '<br>';
                 }
                  this.addedContent += '</div>';
                break;
            }
            else { i++; }
       }
    },
    wmslayerCallback: function (lyr)
    {
         
        for (var i = 0; i < this.ref.datasource.length;)
        {
            if (lyr.get('name') == this.ref.datasource[i].id)
            {
                if (this.itr) {
                    this.addedContent += '<div id="' + this.ref.datasource[i].name + '" class="tab-pane fade in active">';
                    this.itr = false;
                } else { this.addedContent += '<div id="' + this.ref.datasource[i].name + '" class="tab-pane fade">'; }
                var jsonLink = lyr.getSource().getGetFeatureInfoUrl(this.coordinate, this.Constructor.map.getView().getResolution(), 'EPSG:3857', { 'INFO_FORMAT': 'application/json' });
                $.ajax({
                    async: false,
                    url: jsonLink,
                    success: $.proxy(function (data) {
                        
                        for (var j = 0; j < this.ref.datasource[i].attri.length; j++)
                        {
                        var attribute = this.ref.datasource[i].attri[j];
                        var str = data.features[0].properties[attribute];
                        this.addedContent += attribute + ' : ' + str + '<br>';
                        }
                        this.addedContent += '</div>';
                    }, this)
                });
                break;
            }
            else { i++;}
        }
    }
    

 });












