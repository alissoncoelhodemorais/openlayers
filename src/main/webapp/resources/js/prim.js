var map;
// OpenLayers.ProxyHost = "proxy.cgi?url=";

//function init() {
	// allow testing of specific renderers via "?renderer=Canvas", etc
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [ renderer ]
			: OpenLayers.Layer.Vector.prototype.renderers;
	
//	JonesSeg.alo("prim");
	aloSemPro();

	map = new OpenLayers.Map({
		div : "map",
		layers : [
				new OpenLayers.Layer.WMS("OpenLayers WMS",
						"http://localhost:8089/geoserver/wms", {
							layers : "nurc:Img_Sample"
						}),
				/*
				 * / original new OpenLayers.Layer.WMS("States WMS",
				 * "http://demo.opengeo.org/geoserver/wms", {layers:
				 * "topp:states", format: "image/png", transparent: true},
				 * {maxScale: 15000000} ),
				 */
				new OpenLayers.Layer.WMS("States WMS",
						"http://localhost:8089/geoserver/wms", {
							layers : "topp:states",
							format : "image/png",
							transparent : true
						}, {
							maxScale : 15000000
						}), new OpenLayers.Layer.Vector("States", {
					minScale : 15000000,
					strategies : [ new OpenLayers.Strategy.BBOX() ],
					// strategies: [new OpenLayers.Strategy.Fixed()],
					protocol : new OpenLayers.Protocol.WFS({
						url : "http://localhost:8089/geoserver/wfs",
						featureType : "states",
						// json
						outputFormat : "json",
						readFormat : new OpenLayers.Format.GeoJSON(),
						// fim config json
						featureNS : "http://www.openplans.org/topp"
					}),

					renderers : renderer
				}) ],
		center : [ -95.8506355, 37.163851 ],
		zoom : 3
	});
//}
