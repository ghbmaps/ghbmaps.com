require(["esri/Map", "esri/views/MapView", "esri/widgets/Directions", "esri/layers/RouteLayer"], function(
  Map,
  MapView,
  Directions,
  RouteLayer
) {

  // An authorization string used to access the basemap, geocoding and routing services
  const apiKey = "AAPK98556a717f674c8a91c01635c135aaa0m0MBYXpY1R1wZzPeuCVIlDk8FJUtqI1uNbWkQqck3ivGV_eG-tsdxWpmzgPoyCA3";

  // create a new RouteLayer, required for Directions widget
  const routeLayer = new RouteLayer();

  // new RouteLayer must be added to the map
  const map = new Map({
    basemap: "topo-vector",
    layers: [routeLayer]
  });

  const view = new MapView({
    zoom: 11,
    center: [-71.5, 44],
    container: "viewDiv",
    map: map
  });

  // new RouteLayer must be added to Directions widget
  let directionsWidget = new Directions({
    layer: routeLayer,
    apiKey,
    view
  });

  // Add the Directions widget to the top right corner of the view
  view.ui.add(directionsWidget, {
    position: "top-right"
  });
});