var map;

var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [ renderer ]
		: OpenLayers.Layer.Vector.prototype.renderers;

// JonesSeg.alo("prim");
aloSemPro();

// aplicando estilo baseado nos atributos

map = new OpenLayers.Map({
	div : "map",
	layers : [
			new OpenLayers.Layer.WMS("OpenLayers WMS",
					"http://localhost:8089/geoserver/wms", {
						layers : "nurc:Img_Sample"
					}),
			new OpenLayers.Layer.WMS("States WMS",
					"http://localhost:8089/geoserver/wms", {
						layers : "topp:states",
						format : "image/png",
						transparent : true
					}, {
						maxScale : 15000000
					}) ],
	center : [ -95.8506355, 37.163851 ],
	zoom : 3
});

// criando um estilo baseado no contexto dos dados, no caso percentual do sexo da população
var colors = [ "red", "green", "blue" ];
var context = {
	getColor : function(feature) {
		var region = null;
		var fem = feature.attributes.P_FEMALE;
		var mas = feature.attributes.P_MALE;
		// populacao feminina maior que masculina
		if (fem > mas) {
			region = 1;
		} else if (fem < mas) { // somente estados California e Nevada (Oeste)
			region = 2;
		} else {
			region = 0; // estado Wyoming tem porcentagem igual
		}
		return colors[region];
	}
};
var template = {
	fillColor : "${getColor}" // baseado no context.getColor(feature)
};
var estilo = new OpenLayers.Style(template, {
	context : context
});

var estilizada = new OpenLayers.Layer.Vector("States", {
	minScale : 15000000,
//	strategies : [ new OpenLayers.Strategy.BBOX() ],
	 strategies: [new OpenLayers.Strategy.Fixed()],
	protocol : new OpenLayers.Protocol.WFS({
		url : "http://localhost:8089/geoserver/wfs",
		featureType : "states",
		// json
		outputFormat : "json",
		readFormat : new OpenLayers.Format.GeoJSON(),
		// fim config json
		featureNS : "http://www.openplans.org/topp"
	}),
	styleMap : new OpenLayers.StyleMap(estilo),
	renderers : renderer
});

map.addLayer(estilizada);
