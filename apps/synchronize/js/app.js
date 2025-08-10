require([
  "esri/Map",
  "esri/views/MapView",
  "esri/views/SceneView",
  "esri/core/reactiveUtils",
], (Map, MapView, SceneView, reactiveUtils) => {
  const map = new Map({
    basemap: "satellite",
  });

  const view1 = new SceneView({
    container: "view1Div",
    map: map,
  });

  const view2 = new MapView({
    container: "view2Div",
    map: map,
    constraints: {
      snapToZoom: false,
    },
  });

  const views = [view1, view2];
  let active;

  const sync = (source) => {
    if (!active || !active.viewpoint || active !== source) return;

    for (const view of views) {
      if (view !== active) {
        const activeViewpoint = active.viewpoint.clone();

        const latitude = active.center.latitude;
        const scaleConversionFactor = Math.cos((latitude * Math.PI) / 180.0);

        if (active.type === "3d") {
          activeViewpoint.scale /= scaleConversionFactor;
        } else {
          activeViewpoint.scale *= scaleConversionFactor;
        }

        view.viewpoint = activeViewpoint;
      }
    }
  };

  views.forEach((view) => {
    reactiveUtils.watch(
      () => [view.interacting, view.viewpoint],
      ([interacting, viewpoint]) => {
        if (interacting) {
          active = view;
          sync(active);
        }
        if (viewpoint) {
          sync(view);
        }
      }
    );
  });
});
