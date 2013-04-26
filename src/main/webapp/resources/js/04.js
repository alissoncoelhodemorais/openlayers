var map = new OpenLayers.Map("map-id");

//var osm = new OpenLayers.Layer.OSM("SimpleOSM", {isBaseLayer: "true"});
//map.addLayer(osm);

var format = new OpenLayers.Format.CQL();
var wms = new OpenLayers.Layer.WMS(
  "States WMS",

	    "http://localhost:8080/geoserver/wms",
                {layers: "brasil:estados"}
            );
map.addLayer(wms);

var municipios = new OpenLayers.Layer.Vector("States", {
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    url: "http://localhost:8080/geoserver/wfs",
                    featureType: "municipios",
                    featureNS: "http://brasil"
                })            });

var options = {defaultFilter: format.read("NOMEUF = '8838509djsd'")};
municipios.addOptions(options);
map.addLayer(municipios);


            control = new OpenLayers.Control.GetFeature({
                protocol: OpenLayers.Protocol.WFS.fromWMSLayer(wms),
                box: false,
                hover: false,
                multipleKey: "shiftKey",
                toggleKey: "ctrlKey"
            });
            control.events.register("featureselected", this, function(e) {
		wms.setVisibility(false);
		var nome = e.feature.attributes.ESTADO;
		nome = nome.toUpperCase(); // na municipio estah como maiusculo
		municipios.addOptions({defaultFilter: format.read("NOMEUF='" + nome +"'")});
		map.zoomToExtent(e.feature.geometry.getBounds());

            });

            map.addControl(control);
            control.activate();


var mapProjection = map.getProjectionObject();
var proj4326 = new OpenLayers.Projection("EPSG:4326");
map.setCenter(new OpenLayers.LonLat(-51,-12).transform(proj4326, mapProjection), 4);
