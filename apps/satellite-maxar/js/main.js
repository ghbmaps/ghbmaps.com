require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Swipe",
    "esri/widgets/Expand",
    "esri/layers/ImageryLayer",
    "esri/layers/support/RasterFunction",
    "esri/layers/TileLayer"
  ], function (
    Map,
    MapView,
    TileLayer,
    LayerList,
    Swipe,
    Expand,
    ImageryLayer,
    RasterFunction,
    TileLayer
  ) {
    const map = new Map({
      basemap: "satellite"
    });
  
    const infrared = new TileLayer({
      url:  "https://services.arcgisonline.com/arcgis/rest/services/USA_Topo_Maps/MapServer/",
      maxScale: 3000
    });
    map.add(infrared);
  
    const nearInfrared = new TileLayer({
      url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/",
      maxScale: 3000
    });
    map.add(nearInfrared);
  
    const view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 13,
      center: [-71.3050998, 44.2677314], // longitude, latitude
      constraints: {
        maxZoom: 15,
        minZoom: 12
      }
    });
  
    // create a layerlist and expand widget and add to the view
    const layerList = new LayerList({
      view: view
    });
    const llExpand = new Expand({
      view: view,
      content: layerList,
      expanded: false
    });
    view.ui.add(llExpand, "top-right");
  
    // create a new Swipe widget
    const swipe = new Swipe({
      leadingLayers: [infrared],
      trailingLayers: [nearInfrared],
      position: 65, // set position of widget to 35%
      view: view
    });
  
    // add the widget to the view
    view.ui.add(swipe);
  
    //No Code Below This Line
  });
  