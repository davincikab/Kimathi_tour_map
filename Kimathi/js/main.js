
    // Map element
            var map = L.map('map',{
              center:[0.2,36.5],
              zoom:8
            });

    //         MAPBOX TILE LAYERS
            var mapAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                         'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

            var mapUrl ='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
            var tile = L.tileLayer(mapUrl,{id:'mapbox.streets',attribution:mapAttr}),
                street = L.tileLayer(mapUrl,{id:'mapbox.light',attribution:mapAttr});

            tile.addTo(map);

      //   Overlay elements
            var boundary = new L.GeoJSON.AJAX(['data/Boundary.geojson'],{
              style:function(feature, layer){
                return{
                  color:'black',
                  width:1
                };
              }
            }).addTo(map);

            var roads = new L.GeoJSON.AJAX(['data/Roads.geojson'],{
              style:function(feature, layer){
                return{
                  color:'red'
                };
              }
            }).addTo(map);


            var forest = new L.GeoJSON.AJAX(['data/Forest.geojson'],{
              style:function(feature,layer){
                return{
                  fillColor:'#3f0',
                  color:'',
                  blur:3
                };
              },
              onEachFeature:function(feature,layer){
                layer.bindPopup("<h6>Name:</h6>"+feature.properties.names);
              }
            }).addTo(map);


            var sciencep = new L.GeoJSON.AJAX(['data/sciencepark.geojson'],{
              style:function(feature,layer){
                return{
                  fillColor:'gold',
                  color:''
                };
              },
              onEachFeature:function(feature,layer){
                layer.bindPopup("<h6>Name:</h6>"+feature.properties.names);
              }
            }).addTo(map);


            var building = new L.GeoJSON.AJAX(['data/Building.geojson'],{
              style:function(feature,layer){
                return{
                  fillColor:'black',
                  color:''
                };
              },
              onEachFeature:function(feature,layer){
                layer.bindPopup("<h6>Name:</h6>"+feature.properties.names);
              }
            }).addTo(map);


            var pitch = new L.GeoJSON.AJAX(['data/Footbal_pitch.geojson'],{
              style:function(feature,layer){
                return{
                  fillColor:'LawnGreen',
                  color:''
                };
              },
              onEachFeature:function(feature,layer){
                layer.bindPopup("<h6>Name:</h6>"+feature.properties.names);
              }
            }).addTo(map);


            var coffee = new  L.GeoJSON.AJAX(['data/Coffee_plantation.geojson'],{
              style:function( feature,layer){
                return{
                color:"",
                fillColor:"brown",
                Opacity:1
              };
              },
              onEachFeature:function(feature,layer){
                  layer.bindPopup("<h4>Name:"+ feature.properties.names+"</h4>");
              }
            }).addTo(map);




            var maizep = new L.GeoJSON.AJAX(['data/Maize_plantation.geojson'],{
              style:function( feature,layer){
                return{
                fillColor:"green",
                color:""
              };
              },
              onEachFeature:function(feature,layer){
                  layer.bindPopup("<h4>Name:"+ feature.properties.names+"</h4>");
              }
            }).addTo(map);

      // map.fitBounds(maizep.getBounds());

          boundary.on('data:loaded', function(){
            map.fitBounds(boundary.getBounds());
          });


              // DRAW CONTROL UI AND FEATURES
              var drawItem = L.featureGroup().addTo(map);
              

              var drawControl = new L.Control.Draw({
                edit: {
                  featureGroup: drawItem,
                  poly: {
                    allowIntersection: false,
                  }
                },
                draw: {
                  polygon: {
                    allowIntersection: false,
                    showArea: true
                  }
                }

              });
              map.addControl(drawControl);

              // DRAW METHODS
              map.on(L.Draw.Event.CREATED, function (e) {
                var layer = e.layer;
                drawItem.addLayer(layer);
              });

              map.on(L.Draw.Event.EDITED, function (e) {
                var layers = e.layers;
                var countOfEditedLayers = 0;
                layers.eachLayer(function (layer) {
                  countOfEditedLayers++;
                });
                console.log("Edited " + countOfEditedLayers + " layers");
              });

              L.DomUtil.get('changeColor').onclick = function () {
                drawControl.setDrawingOptions({ rectangle: { shapeOptions: { color: '#000000' } } });
              };


    //       BASEMAPAS objects
           var baselayer ={
             'Street Map':tile,
             'Grayscale':street,

           };

    //       MAP OVERLAYS object
            var overlays={
              'Boundary':boundary,
              'Conservancy':forest,
              'Coffee Plantation':coffee,
              'Maize Plantation':maizep,
              'Playing Field':pitch,
              'Building':building,
              'Roads':roads,
              'Draw Item':drawItem
            };

    //    ADD OVERLAYS AND BASEMAPA=S TO THE MAP
           L.control.layers(baselayer,overlays).addTo(map);

           var layers = new L.LayerGroup([building,coffee,pitch,maizep,sciencep]);

    //     GEOLOCATION
           	map.on('locationfound',foundLocation);
           	map.on('locationerror',NotfoundLocation);
           	map.locate({setView:true,zoom:10});

          	function foundLocation(e){
          		var date = new Date(e.timestamp);

          		L.marker(e.latlng).addTo(map).bindPopup(e.latlng + date.toString());
          	}

            function NotfoundLocation(e){
            	 alert("Enable location in your gadget")
            	}

      // SEARCH ELEMENT USING LEAFLET-SEARCH
          var controlSearch = new L.Control.Search({
                 position:'topleft',
                 layer:layers,
                 propertyName:'names',
                 marker: false,

            moveToLocation: function(LatLng,title,map){
              var zoom = map.getBoundsZoom(LatLng.layer.getBounds());
              map.setView(LatLng,zoom);
            }
             });

          controlSearch.on('search:locationfound', function(e) {

              e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
              if(e.layer._popup)
                  e.layer.openPopup();

      //RESTORE FEATURE COLOR OR STYLING
          }).on('search:collapsed', function(e) {

              featuresLayer.eachLayer(function(layer) {
                  featuresLayer.resetStyle(layer);
              });
          });


           map.addControl( controlSearch );

      
//   function returnProperties(json, latlong){
//     var att = json.properties;
//     return
//   }
