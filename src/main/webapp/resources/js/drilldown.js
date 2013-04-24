var map;

var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [ renderer ]
		: OpenLayers.Layer.Vector.prototype.renderers;

// JonesSeg.alo("prim");
aloSemPro();

// aplicando estilo baseado nos atributos

var ctrlNav = new OpenLayers.Control.Navigation({documentDrag: true});
map = new OpenLayers.Map({
	div : "map",
	layers : [
			new OpenLayers.Layer.WMS("OpenLayers WMS",
					"http://localhost:8089/geoserver/wms", {
						layers : "nurc:Img_Sample"
					}) ],
	center : [ -50, -12 ],
	controls: [
	            new OpenLayers.Control.PanZoom(),
	            new OpenLayers.Control.Permalink(),
	            ctrlNav
	        ],
	zoom : 3
});

var regioes = new OpenLayers.Layer.WMS("Regioes WMS",
		"http://localhost:8089/geoserver/wms", {
	layers : "brasil:regioes",
	format : "image/png",
	transparent : true
}, {
});

// identificando qual feature foi clicada
select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
    new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
});

map.addLayers([regioes, select]);


control = new OpenLayers.Control.GetFeature({
    protocol: OpenLayers.Protocol.WFS.fromWMSLayer(regioes),
    box: true,
    hover: false,
    multipleKey: "shiftKey",
    toggleKey: "ctrlKey"
});
control.events.register("featureselected", this, function(e) {
    select.addFeatures([e.feature]);
});
control.events.register("featureunselected", this, function(e) {
    select.removeFeatures([e.feature]);
});


// dar zoom na area de feature


map.addControl(control);

// foi preciso desativar o controle de pan do mouse
ctrlNav.deactivate();
control.activate();
ctrlNav.activate();


function init(){
    OpenLayers.ProxyHost= "proxy.cgi?url=";
    map = new OpenLayers.Map('map', {
        controls: [
            new OpenLayers.Control.PanZoom(),
            new OpenLayers.Control.Permalink(),
            new OpenLayers.Control.Navigation()
        ]
    });
    layer = new OpenLayers.Layer.WMS(
        "States WMS/WFS",
        "http://v2.suite.opengeo.org/geoserver/ows",
        {layers: 'usa:states', format: 'image/gif'}
    );
    select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
        new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
    });
    hover = new OpenLayers.Layer.Vector("Hover");
    map.addLayers([layer, hover, select]);
    
    control = new OpenLayers.Control.GetFeature({
        protocol: OpenLayers.Protocol.WFS.fromWMSLayer(layer),
        box: true,
        hover: true,
        multipleKey: "shiftKey",
        toggleKey: "ctrlKey"
    });
    control.events.register("featureselected", this, function(e) {
        select.addFeatures([e.feature]);
    });
    control.events.register("featureunselected", this, function(e) {
        select.removeFeatures([e.feature]);
    });
    control.events.register("hoverfeature", this, function(e) {
        hover.addFeatures([e.feature]);
    });
    control.events.register("outfeature", this, function(e) {
        hover.removeFeatures([e.feature]);
    });
    map.addControl(control);
    control.activate();

    map.setCenter(new OpenLayers.Bounds(-140.444336,25.115234,-44.438477,50.580078).getCenterLonLat(), 3);
}