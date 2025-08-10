require(["esri/config", "esri/Map", "esri/views/MapView"], (
  esriConfig,
  Map,
  MapView
) => {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurPiRfSlGkoATgphm6SBlIEiDs9GHvcFQ0AC-K61IKcEUL6-0Yc1c7go1xswnSlrePZ7aTJmgj31LWhSp_PEVWImxGqboMIFtngYi4EaXvji1ny5o0MRA3ScPZAvf1DqyvbeJELi8Z3b0Pf7lML0lhcOSUO2BdffCZtZz8R1SmAOQbmLrW90Js7rj9xTivfM-EXAeKCf4tnFJrsJBKJRrh9s.AT1_kkSNM6FY";

  const map = new Map({
    basemap: "arcgis/imagery",
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-118.805, 34.027],
    zoom: 13,
  });

  document
    .getElementById("basemapDropdown")
    .addEventListener("calciteComboboxChange", (event) => {
      const selected = event.target.selectedItems[0];
      if (selected && selected.value) {
        map.basemap = selected.value;
      }
    });
});
