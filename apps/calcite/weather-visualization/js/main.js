require([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/widgets/Expand",
  "esri/widgets/Weather",
  "esri/widgets/Daylight",
], (WebScene, SceneView, Expand, Weather, Daylight) => {
  /***********************************
   * Create the SceneView
   ***********************************/
  // Load a webscene
  const scene = new WebScene({
    portalItem: {
      id: "d842cdf7e4d14381ba31c208075742dc",
    },
  });

  // Create a new SceneView and set the weather to cloudy
  const view = new SceneView({
    map: scene,
    container: "viewDiv",
    qualityProfile: "high",

    environment: {
      weather: {
        type: "cloudy", // autocasts as new CloudyWeather({ cloudCover: 0.3 })
        cloudCover: 0.3,
      },
      atmosphere: {
        quality: "high",
      },
      lighting: {
        waterReflectionEnabled: true,
        ambientOcclusionEnabled: true,
      },
    },
  });

  /***********************************
   * Add the widgets' UI elements to the view
   ***********************************/
  const weatherExpand = new Expand({
    view: view,
    content: new Weather({
      view: view,
    }),
    group: "top-right",
    expanded: true,
  });

  const daylightExpand = new Expand({
    view: view,
    content: new Daylight({
      view: view,
    }),
    group: "top-right",
  });
  view.ui.add([weatherExpand, daylightExpand], "top-right");

  /***********************************
   * Add functionality to change between flooding and no flooding
   ***********************************/
  // Wait for the view to be loaded, in order to being able to retrieve the layer
  view.when(() => {
    // Find the layer for the
    let floodLevel = scene.allLayers.find(function (layer) {
      return layer.title === "Flood Level";
    });

    const selection = document.getElementById("selection");

    selection.addEventListener("calciteSegmentedControlChange", () => {
      switch (selection.selectedItem.value) {
        case "flooding":
          // Change the weather to rainy to match the flooding scenario
          view.environment.weather = {
            type: "rainy", // autocasts as new RainyWeather({ cloudCover: 0.7, precipitation: 0.3 })
            cloudCover: 0.7,
            precipitation: 0.3,
          };
          // Turn on the water layer showing the flooding
          floodLevel.visible = true;
          break;

        case "noFlooding":
          // Change the weather back to cloudy
          view.environment.weather = {
            type: "cloudy", // autocasts as new CloudyWeather({ cloudCover: 0.3 })
            cloudCover: 0.3,
          };

          // Turn off the water layer showing the flooding
          floodLevel.visible = false;
          break;
      }
    });
  });
});
