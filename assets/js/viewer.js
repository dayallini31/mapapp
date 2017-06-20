/**
Viewer - singleton
**/


var app = app || {}; //singleton
app['layers'] = [];

//app.container = document.getElementById('popup');
//app.content = document.getElementById('popup-content');
//app.closer = document.getElementById('popup-closer');
 
 

app.MapObj = new ol.Map({
    layers: [
     new ol.layer.Tile({
         source: new ol.source.OSM()
     })
    ],    
   target: 'map-canvas',
    view: new ol.View({
        center: [0, 0],
        zoom: 2
    }) 
});


app.CustomLayerHandler = new vector({
    'map': app.MapObj,
    'dropdownBind': 'w1_adddata',
    'appLayers': app['layers']     
});

app.googleStreet = new googleStreet({
    'node': 'streetViewDiv',
    'toggle': 'gsvtoggle'
});

app.clickEventHandler = new clickEvnt({
    'map': app.MapObj,
    'container': 'popup',
    'content': 'popup-content',
    'closer': 'popup-closer'
       
});

app.query = new cqlquery({
    'layersQueryList': 'layersQueryList'
});
 

//Trigger Functions after DOM Load
$(document).ready(function () {
    app.CustomLayerHandler.populateDropdownData(); 
});

 