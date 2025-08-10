const [Map, FeatureLayer, LabelClass, AggregateField] = await $arcgis.import([
  "@arcgis/core/Map.js",
  "@arcgis/core/layers/FeatureLayer.js",
  "@arcgis/core/layers/support/LabelClass.js",
  "@arcgis/core/layers/support/AggregateField.js",
]);

const colors = ["#d7e1ee", "#cbd6e4", "#b3bfd1", "#c86558", "#991f17"];

const featureReduction = {
  type: "binning",
  fields: [
    new AggregateField({
      name: "aggregateCount",
      statisticType: "count",
    }),
  ],
  fixedBinLevel: 6,
  labelsVisible: true,
  labelingInfo: [
    new LabelClass({
      minScale: 144448,
      maxScale: 0,
      deconflictionStrategy: "none",
      symbol: {
        type: "text",
        color: "white",
        font: {
          family: "Noto Sans",
          size: 10,
          weight: "bold",
        },
        haloColor: colors[4],
        haloSize: 0.5,
      },
      labelExpressionInfo: {
        expression: "Text($feature.aggregateCount, '#,###')",
      },
    }),
  ],
  popupEnabled: true,
  popupTemplate: {
    title: "Car crashes",
    content: "{aggregateCount} car crashes occurred in this area.",
  },
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [0, 255, 71, 1],
      outline: {
        color: "rgba(153, 31, 23, 0.3)",
        width: 0.3,
      },
    },
    visualVariables: [
      {
        type: "color",
        field: "aggregateCount",
        legendOptions: {
          title: "Number of crashes",
        },
        stops: [
          { value: 0, color: colors[0] },
          { value: 25, color: colors[1] },
          { value: 75, color: colors[2] },
          { value: 200, color: colors[3] },
          { value: 300, color: colors[4] },
        ],
      },
    ],
  },
};

const year = 2020;
const layer = new FeatureLayer({
  title: "Motor vehicle crashes (2020)",
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/NYC_motor_crashes/FeatureServer/0",
  featureReduction,
  popupTemplate: {
    title: "Crash location",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "CRASH_DATE",
            label: "Date",
            dateFormat: "day-short-month-year-long-time",
          },
          {
            fieldName: "NUMBER_OF_PERSONS_KILLED",
            label: "Fatalities",
          },
          {
            fieldName: "NUMBER_OF_PERSONS_INJURED",
            label: "Injuries",
          },
        ],
      },
    ],
  },
  definitionExpression: `CRASH_DATE > Date '12-31-${
    year - 1
  }' AND CRASH_DATE < Date '01-01-${year + 1}'`,
  renderer: {
    type: "simple",
    label: "Crash location",
    symbol: {
      type: "simple-marker",
      style: "circle",
      size: 5,
      color: colors[3],
      outline: {
        style: "solid",
        color: [15, 15, 15, 0.3],
        width: 0.5,
      },
    },
  },
});

const viewElement = document.querySelector("arcgis-map");
viewElement.map = new Map({
  basemap: "gray-vector",
  layers: [layer],
});

viewElement.constraints = {
  snapToZoom: false,
};

await viewElement.viewOnReady();

const referenceLayer = viewElement.map.basemap.referenceLayers.getItemAt(0);
referenceLayer.opacity = 0.2;

const toggleButton = document.getElementById("showBins");
toggleButton.onclick = () => {
  layer.featureReduction = layer.featureReduction ? null : featureReduction;
};
