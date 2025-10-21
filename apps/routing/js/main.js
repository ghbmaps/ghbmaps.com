require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Directions",
  "esri/layers/RouteLayer",
], function (Map, MapView, Directions, RouteLayer) {
  // An authorization string used to access the basemap, geocoding and routing services
  const apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurPiRfSlGkoATgphm6SBlIEittqM14pBuhjEUR2wvb-bhy52jE5du7dlEmlnIsKcyr56_PCbE_UG6N_E17hMm6FUSD3dqTOuRxIPwwBrPmZpZgaogz3_ijGqtyZoTOH6zDkkCptU6j55ybxnhhTBndfjO4WYrTflDMO27O3gWf-LGy60dZ74f1Y6qoY4OU1ZnUwS7JF38ZM1KkSne5Fzoy1M.AT1_siGxYPuP";

  // create a new RouteLayer, required for Directions widget
  const routeLayer = new RouteLayer();

  // new RouteLayer must be added to the map
  const map = new Map({
    basemap: "topo-vector",
    layers: [routeLayer],
  });

  const view = new MapView({
    zoom: 11,
    center: [-71.5, 44],
    container: "viewDiv",
    map: map,
  });

  // new RouteLayer must be added to Directions widget
  let directionsWidget = new Directions({
    layer: routeLayer,
    apiKey,
    view,
  });

  // Add the Directions widget to the top right corner of the view
  view.ui.add(directionsWidget, {
    position: "top-right",
  });
});
