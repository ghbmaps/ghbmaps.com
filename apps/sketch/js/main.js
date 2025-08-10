require([
  "esri/widgets/Sketch",
  "esri/Map",
  "esri/layers/GraphicsLayer",
  "esri/views/MapView"
], (Sketch, Map, GraphicsLayer, MapView) => {
  const graphicsLayer = new GraphicsLayer();

  const map = new Map({
    basemap: "topo-vector",
    layers: [graphicsLayer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 11,
    center: [-71.5, 44]
  });

  view.when(() => {
    const sketch = new Sketch({
      layer: graphicsLayer,
      view: view,
      // graphic will be selected as soon as it is created
      creationMode: "update"
    });

    view.ui.add(sketch, "top-right");
  });
});