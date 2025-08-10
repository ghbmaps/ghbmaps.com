require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
], (Map, MapView, FeatureLayer, Legend, Expand) => {
  const map = new Map({
    basemap: "gray-vector",
  });
  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-84.78824, 42.4393],
    zoom: 6,
    constraints: {
      minScale: 9500000,
      maxScale: 900000,
      snapToZoom: false,
    },
  });
  const layer = new FeatureLayer({
    portalItem: {
      id: "a7c5a8c8ea42416e8bd92df9872cc51b",
    },
    renderer: {
      type: "pie-chart", // autocasts as new PieChartRenderer
      size: 10,
      attributes: [
        {
          color: "#ed5151",
          label: "No high school diploma",
          field: "SOMEHS_CY",
        },
        {
          field: "HSGRAD_CY",
          color: "#149ece",
          label: "High school diploma",
        },
        {
          field: "CollegeEducated",
          color: "#a7c636",
          label: "College educated",
        },
      ],
      backgroundFillSymbol: {
        // polygon fill behind pie chart
        color: [127, 127, 127, 0.2],
        outline: {
          width: 1,
          color: [255, 255, 255, 0.3],
        },
      },
      outline: {
        width: 1.5,
        color: "grey",
      },
      visualVariables: [
        {
          type: "size",
          valueExpression:
            "$feature.SOMEHS_CY + $feature.HSGRAD_CY + $feature.CollegeEducated",
          minDataValue: 20000,
          maxDataValue: 500000,
          minSize: 12,
          maxSize: 48,
        },
      ],
    },
    popupTemplate: {
      title: "{COUNTY}, {STATE}",
      content: [
        {
          type: "media",
          mediaInfos: [
            {
              title: "{COUNTY} County Education Attainment",
              type: "pie-chart",
              value: {
                fields: ["SOMEHS_CY", "HSGRAD_CY", "CollegeEducated"],
              },
            },
          ],
        },
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "ASSCDEG_CY",
              label: "Number of Associate's degrees",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "BACHDEG_CY",
              label: "Number of Bachelor's Degrees",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "GRADDEG_CY",
              label: "Number of Graduate degrees",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "CollegeEducated",
              label: "Number of college degrees",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "EDUCBASECY",
              label: "Total population base",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "expression/percent-educated",
              label: "Percent college educated",
            },
          ],
        },
      ],
      fieldInfos: [
        {
          fieldName: "HSGRAD_CY",
          label: "High school diploma",
        },
        {
          fieldName: "SOMEHS_CY",
          label: "No high school diploma",
        },
        {
          fieldName: "CollegeEducated",
          label: "College educated",
        },
      ],
      expressionInfos: [
        {
          name: "percent-educated",
          title: "Percent college educated",
          expression:
            "ROUND((($feature.CollegeEducated/$feature.EDUCBASECY)*100),2)+ '%'",
        },
      ],
    },
  });
  map.add(layer);

  const legend = new Legend({
    view: view,
  });
  view.ui.add(legend, "bottom-left");

  view.ui.add(
    new Expand({
      content: document.getElementById("filter"),
      view: view,
      expandIconClass: "esri-icon-sliders-horizontal",
      expandTooltip: "Filter",
    }),
    "top-right"
  );

  const filterBy = document.getElementById("filterBy");
  const operator = document.getElementById("operator");
  const filterPct = document.getElementById("filterPct");

  document.getElementById("filterBtn").addEventListener("click", () => {
    if (filterBy.value && operator.value && filterPct.value) {
      document.getElementById("error").style.display = "none";
      let filterStr =
        "(" +
        filterBy.value +
        "/ (SOMEHS_CY + HSGRAD_CY + CollegeEducated) *100 )" +
        operator.value +
        filterPct.value;
      layer.featureEffect = {
        filter: {
          where: filterStr,
        },
        excludedEffect: "opacity(20%)",
      };
    } else {
      document.getElementById("error").style.display = "block";
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("error").style.display = "none";
    layer.featureEffect = null;
    filterPct.value = null;
  });
});
