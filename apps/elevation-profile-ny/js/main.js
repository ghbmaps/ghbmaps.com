require([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/widgets/ElevationProfile"
], (WebScene, SceneView, ElevationProfile) => {
  const webscene = new WebScene({
    portalItem: {
      id: "d847160d587c4293ab4592d60ae7907c"
    }
  });

  // create the scene view
  const view = new SceneView({
    container: "viewDiv",
    map: webscene,
    camera: {
      position: {
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: -8238359,
        y: 4967229,
        z: 686
      },
      heading: 353,
      tilt: 66
    }
  });

  // create the elevation profile widget
  const elevationProfile = new ElevationProfile({
    view: view,
    // configure widget with desired profile lines
    profiles: [
      {
        type: "ground" // first profile line samples the ground elevation
      },
      {
        type: "view" // second profile samples the view and shows building profiles
      }
    ],
    // hide the select button
    // this button can be displayed when there are polylines in the
    // scene to select and display the elevation profile for
    visibleElements: {
      selectButton: false
    }
  });

  // add the widget to the view
  view.ui.add(elevationProfile, "top-right");
});