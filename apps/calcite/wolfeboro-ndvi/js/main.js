require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/TileLayer",
  "esri/widgets/LayerList",
  "esri/widgets/Swipe",
  "esri/widgets/Expand",
], (Map, MapView, TileLayer, LayerList, Swipe, Expand) => {
  const map = new Map({
    basemap: "satellite",
  });

  const infrared = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/EvDRLcHhbHG5BnwT/arcgis/rest/services/Wolfeboro_NDVI_WKID_3857_1988/MapServer",
    maxScale: 3000,
  });
  map.add(infrared);

  const nearInfrared = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/EvDRLcHhbHG5BnwT/arcgis/rest/services/Wolfeboro_NDVI_WKID_3857_2022/MapServer",
    maxScale: 3000,
  });
  map.add(nearInfrared);

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 12,
    center: [-71.1751175, 43.6082771], // longitude, latitude
    constraints: {
      maxZoom: 18,
      minZoom: 12,
    },
  });

  // create a layerlist and expand widget and add to the view
  const layerList = new LayerList({
    view: view,
  });
  const llExpand = new Expand({
    view: view,
    content: layerList,
    expanded: false,
  });
  view.ui.add(llExpand, "top-right");

  // create a new Swipe widget
  const swipe = new Swipe({
    leadingLayers: [infrared],
    trailingLayers: [nearInfrared],
    position: 50, // set position of widget to 35%
    view: view,
  });

  // add the widget to the view
  view.ui.add(swipe);

  const button = document.getElementById("info-button");
  const modal = document.getElementById("info-modal");
  const close = document.getElementById("close-button");

  button.addEventListener("click", function () {
    modal.open = true;
  });

  close.addEventListener("click", function () {
    modal.open = false;
  });
});
