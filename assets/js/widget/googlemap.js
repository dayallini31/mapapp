var googleStreet = Class.create({

    init: function (Constructor) {
        this.Constructor = Constructor;
        this.Constructor.isEnabled = false;
        jQuery.pubsub.subscribe('click.googleStreet', $.proxy(function (topic, msg) {
            this.subscribeEvt(topic, msg);            
        },this));
    },
    toggleOnclick: function () {

        if (this.Constructor.isEnabled) {
            this.Constructor.isEnabled = false;
            $('#' + this.Constructor.toggle).html('enable');
            $("#" + this.Constructor.node).css("display", "none");
            

        } else {
            this.Constructor.isEnabled = true;
            $('#' + this.Constructor.toggle).html('disable');
            $("#" + this.Constructor.node).css("display", "block");
        }
    },
    subscribeEvt: function (topic, msg) {

      var panorama = new google.maps.StreetViewPanorama(
      document.getElementById(this.Constructor.node), {
          position: { lat: ol.proj.transform(msg.evt.coordinate, 'EPSG:3857', 'EPSG:4326')[1], lng: ol.proj.transform(msg.evt.coordinate, 'EPSG:3857', 'EPSG:4326')[0] },
          pov: {
              heading: 34,
              pitch: 10
          }
      });
    }

});
