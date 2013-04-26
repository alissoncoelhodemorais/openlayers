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
		defaultFilter: format.read("NOMEUF = '8838509djsd'"),
                    featureNS: "http://brasil"
                })            });

map.addLayer(municipios);
municipios.setVisibility(false);


            control = new OpenLayers.Control.GetFeature({
                protocol: OpenLayers.Protocol.WFS.fromWMSLayer(wms),
                box: false,
                hover: false,
                multipleKey: "shiftKey",
                toggleKey: "ctrlKey"
            });
            control.events.register("featureselected", this, function(e) {
		var nome = e.feature.attributes.ESTADO;
		// wms.mergeNewParams({CQL_FILTER: "ESTADO='" + nome + "'"});
		nome = nome.toUpperCase(); // na municipio estah como maiusculo
		municipios.protocol.defaultFilter = format.read("NOMEUF='" + nome +"'");
		municipios.setVisibility(true);
		municipios.refresh({force: true});
		map.zoomToExtent(e.feature.geometry.getBounds());

            });

            map.addControl(control);
            control.activate();


var mapProjection = map.getProjectionObject();
var proj4326 = new OpenLayers.Projection("EPSG:4326");
map.setCenter(new OpenLayers.LonLat(-51,-12).transform(proj4326, mapProjection), 4);
