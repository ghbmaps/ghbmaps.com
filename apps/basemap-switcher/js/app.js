require(["esri/config", "esri/Map", "esri/views/MapView"], (
  esriConfig,
  Map,
  MapView
) => {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurPiRfSlGkoATgphm6SBlIEittqM14pBuhjEUR2wvb-bhy52jE5du7dlEmlnIsKcyr56_PCbE_UG6N_E17hMm6FUSD3dqTOuRxIPwwBrPmZpZgaogz3_ijGqtyZoTOH6zDkkCptU6j55ybxnhhTBndfjO4WYrTflDMO27O3gWf-LGy60dZ74f1Y6qoY4OU1ZnUwS7JF38ZM1KkSne5Fzoy1M.AT1_siGxYPuP";

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
