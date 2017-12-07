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

/*
var raster_old = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
  })
});
*/

var raster = new ol.layer.Tile({
  source: new ol.source.Stamen({layer: 'watercolor'})
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
    
    var imageSrc = feature.get('image' );
    var text = feature.get('text');
    
    if (feature) {
      var coordinates = feature.getGeometry().getCoordinates();
      if(feature.get('hist')) {
        content.innerHTML = '<img src="' + checkifExist(imageSrc) + ' " ' + '<p>' + feature.get('name') + '<br><br>' + feature.get('hist') + '</p>';
      }
      else {
        content.innerHTML = '<img src="' + checkifExist(imageSrc) + ' " ' + '<p>' + feature.get('name') + '<br><br>' + checkifExist(text) + '</p>';
      }
      overlay.setPosition(coordinates);
    } 
    
    function checkifExist(source) {
      if(source) {
        return source
      }
      else {
        return '';
      }
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
    if(feature.get('hist')) {
      return new ol.style.Style({
        image: new ol.style.Icon({
          src: 'img/Military_Flag_of_Finland.svg',
          scale: 0.02
        })
      });
    }
    else if(feature.get('name') === 'Enjoy the view') {
      return new ol.style.Style({
        image: new ol.style.Icon({
          src: 'img/eyes.png',
          scale: 0.2
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