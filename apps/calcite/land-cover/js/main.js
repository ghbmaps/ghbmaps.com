require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/ImageryTileLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/GroupLayer",
  "esri/renderers/UniqueValueRenderer",
  "esri/renderers/support/UniqueValueInfo",
  "esri/geometry/SpatialReference",
], (
  Map,
  MapView,
  ImageryTileLayer,
  FeatureLayer,
  GroupLayer,
  UniqueValueRenderer,
  UniqueValueInfo,
  SpatialReference
) =>
  (async () => {
    // Reproject the data to the projection selected by the user
    const wkidSelect = document.getElementById("projectWKID");
    wkidSelect.addEventListener("change", () => {
      view.spatialReference = {
        wkid: wkidSelect.value,
      };
    });

    const viewSpatialReference = new SpatialReference({
      wkid: wkidSelect.value,
    });

    // this states layer will be used as the basemap
    const statesLayer = new FeatureLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "#505050",
          outline: {
            color: "#DCDCDC",
            width: "0.5px",
          },
        },
      },
      spatialReference: viewSpatialReference,
      effect: "drop-shadow(-10px, 10px, 6px gray)",
    });

    // land cover types to set when user changes the land cover type
    const landTypes = {
      forests: {
        categories: ["Deciduous Forest", "Evergreen Forest", "Mixed Forest"],
        color: ["#006622", "#006622", "#006622", "#006622"],
      },
      developed: {
        categories: [
          "Developed, Open Space",
          "Developed, Low Intensity",
          "Developed, Medium Intensity",
          "Developed, High Intensity",
        ],
        color: ["#E5D0DD", "#E08B88", "#FF0000", "#A70000"],
      },
      crops: {
        categories: ["Cultivated Crops"],
        color: ["#A56400"],
      },
      hay: {
        categories: ["Hay/Pasture"],
        color: ["#D3F40E"],
      },
      wetlands: {
        categories: ["Woody Wetlands", "Emergent Herbaceuous Wetlands"],
        color: ["#0073e6", "#0073e6"],
      },
    };

    // initialize the imagery layer with lerc format
    const layer = new ImageryTileLayer({
      url: "https://tiledimageservices.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/NLCD_2016_Land_Cover_L48_20190424/ImageServer",
      renderer: changeLandCoverType(landTypes.forests),
      blendMode: "color-dodge",
      effect: "bloom(0.5, 0.5px, 20%) drop-shadow(1px, 1px, 1px, grey)",
    });

    const groupLayer = new GroupLayer({
      layers: [layer],
      title: "Forested areas 2016",
    });

    const map = new Map({
      basemap: {
        baseLayers: [statesLayer],
      },
      layers: [groupLayer],
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      spatialReference: viewSpatialReference,
      center: {
        type: "point",
        x: 0,
        y: 0,
        spatialReference: viewSpatialReference,
      },
      scale: 19975114,
      background: {
        color: "#F5F5F5",
      },
    });

    // drop down for changing the land cover types
    const landCoverTypeSelect = document.getElementById("landCoverTypeSelect");
    landCoverTypeSelect.addEventListener(
      "calciteRadioButtonGroupChange",
      (event) => {
        if (!layer.loaded) {
          return;
        }
        let renderer = layer.renderer.clone();
        const value = landCoverTypeSelect.selectedItem.value;
        renderer = changeLandCoverType(landTypes[value]);
        layer.renderer = renderer;
      }
    );

    // this function creates a new instance of group and imagery layer whenever
    // the app is loaded or the view projection changes
    document.getElementById("forests").checked = true;

    // this function is called whenever user changes the land cover type
    // from the drop down. It creates a unique value renderer for the
    // land cover type the user selected.
    function changeLandCoverType(landType) {
      const uvr = new UniqueValueRenderer({
        field: "NLCD_Land",
        uniqueValueInfos: [],
      });
      landType.categories.forEach((value, i) => {
        const uniqueValue = new UniqueValueInfo({
          value,
          symbol: {
            type: "simple-fill",
            color: landType.color[i],
          },
        });
        uvr.uniqueValueInfos.push(uniqueValue);
      });
      return uvr;
    }
  })());
