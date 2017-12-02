var scaleLineControl = new ol.control.ScaleLine();

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var guideLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/points.geojson',
    format: new ol.format.GeoJSON()
  }),
  style: pointStyleFunction
});

var historyLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/history.geojson',
    format: new ol.format.GeoJSON()
  }),
  style: pointStyleFunction
});

var overlay = new ol.Overlay(({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
}));

closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var raster = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
  })
});

var map = new ol.Map({
  controls: ol.control.defaults({
    zoom: true,
    attribution: false
  }).extend([
  scaleLineControl
  ]),
  overlays: [overlay],
  target: 'map',
  layers: [raster,
  guideLayer, historyLayer
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([24.828187589, 60.184065394]),
    zoom: 15
  })
});

map.on('singleclick', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
  function(feature) {
    return feature;
  });

  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    if(feature.get('text')) {
      content.innerHTML = '<p>' + feature.get('name') + '<br>' + feature.get('text') + '</p>';
    }
    else {
      content.innerHTML = '<p>' + feature.get('name') + '</p>';
    }
    overlay.setPosition(coordinates);
  } 
});

$('#switcher').on('click', function(event) {
    if(event.target.id === 'history') {
        historyLayer.setVisible(true);
        guideLayer.setVisible(false);
      }
      else {
        guideLayer.setVisible(true);
        historyLayer.setVisible(false);
      }
});

historyLayer.setVisible(false);

function pointStyleFunction(feature) {
  if(feature.get('text')) {
    return new ol.style.Style({
      image: new ol.style.Icon({
        src: 'img/Military_Flag_of_Finland.svg',
        scale: 0.02
      })
    });
  }
  else {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({color: 'rgba(0, 0, 255, 0.5)'}),
        stroke: new ol.style.Stroke({color: 'blue', width: 1})
      })
    });
  }
}