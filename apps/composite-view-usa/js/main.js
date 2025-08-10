require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend"
  ], function (Map, MapView, FeatureLayer, Legend) {
    var layer = new FeatureLayer({
      portalItem: {
        id: "27ce1183611f47f884a98cb0689487f0"
      },
      outFields: [
        "NAME",
        "B01001_001E",
        "B01001_calc_numGE65E",
        "B01001_calc_pctGE65E",
        "B01001_calc_numLT18E",
        "B01001_calc_pctLT18E",
        "B01001_calc_numGE65E",
        "B01001_calc_pctGE65E",
        "B01001_002E",
        "B01001_026E"
      ],
      title: "U.S. Counties"
    });
  
    var map = new Map({
      layers: [layer]
    });
  
    var mainView = new MapView({
      container: "mainViewDiv",
      map: map,
      popup: {
        highlightEnabled: false,
        dockEnabled: true,
        dockOptions: {
          breakpoint: false,
          position: "top-left"
        }
      },
      extent: {
        xmin: -3094834,
        ymin: -44986,
        xmax: 2752687,
        ymax: 3271654,
        spatialReference: {
          wkid: 5070
        }
      },
      spatialReference: {
        // NAD_1983_Contiguous_USA_Albers
        wkid: 5070
      },
      ui: {
        components: ["attribution"]
      }
    });
    mainView.ui.add(
      new Legend({
        view: mainView
      }),
      "bottom-right"
    );
  
    var akView = new MapView({
      container: "akViewDiv",
      map: map,
      extent: {
        xmin: 396381,
        ymin: -2099670,
        xmax: 3393803,
        ymax: 148395,
        spatialReference: {
          wkid: 5936
        }
      },
      spatialReference: {
        // WGS_1984_EPSG_Alaska_Polar_Stereographic
        wkid: 5936
      },
      ui: {
        components: []
      }
    });
    mainView.ui.add("akViewDiv", "bottom-left");
  
    var hiView = new MapView({
      container: "hiViewDiv",
      map: map,
      extent: {
        xmin: -342537,
        ymin: 655453,
        xmax: 231447,
        ymax: 1023383,
        spatialReference: {
          wkid: 102007
        }
      },
      spatialReference: {
        // Hawaii_Albers_Equal_Area_Conic
        wkid: 102007
      },
      ui: {
        components: []
      }
    });
    mainView.ui.add("hiViewDiv", "bottom-left");
  
    mainView
      .when(maintainFixedExtent)
      .then(disableNavigation)
      .then(disablePopupOnClick)
      .then(enableHighlightOnPointerMove);
    akView
      .when(disableNavigation)
      .then(disablePopupOnClick)
      .then(enableHighlightOnPointerMove);
    hiView
      .when(disableNavigation)
      .then(disablePopupOnClick)
      .then(enableHighlightOnPointerMove);
  
    function maintainFixedExtent(view) {
      var fixedExtent = view.extent.clone();
      // keep a fixed extent in the view
      // when the view size changes
      view.on("resize", function () {
        view.extent = fixedExtent;
      });
      return view;
    }
  
    let highlight = null;
    let lastHighlight = null;
  
    function enableHighlightOnPointerMove(view) {
      view.whenLayerView(layer).then(function (layerView) {
        view.on("pointer-move", function (event) {
          view.hitTest(event).then(function (response) {
            lastHighlight = highlight;
  
            // if a feature is returned, highlight it
            // and display its attributes in the popup
            // if no features are returned, then close the popup
            var id = null;
  
            if (response.results.length) {
              var feature = response.results.filter(function (result) {
                return result.graphic.layer === layer;
              })[0].graphic;
  
              feature.popupTemplate = layer.popupTemplate;
              id = feature.attributes.OBJECTID;
              highlight = layerView.highlight([id]);
              var selectionId = mainView.popup.selectedFeature
                ? mainView.popup.selectedFeature.attributes.OBJECTID
                : null;
  
              if (highlight && id !== selectionId) {
                mainView.popup.open({
                  features: [feature]
                });
              }
            } else {
              if (mainView.popup.visible) {
                mainView.popup.close();
                mainView.popup.clear();
              }
            }
  
            // remove the previous highlight
            if (lastHighlight) {
              lastHighlight.remove();
              lastHighlight = null;
            }
          });
        });
      });
    }
  
    // disables all navigation in the view
    function disableNavigation(view) {
      view.popup.dockEnabled = true;
  
      // Removes the zoom action on the popup
      view.popup.actions = [];
  
      // stops propagation of default behavior when an event fires
      function stopEvtPropagation(event) {
        event.stopPropagation();
      }
  
      // disable mouse wheel scroll zooming on the view
      view.navigation.mouseWheelZoomEnabled = false;
  
      // disable zooming via double-click on the view
      view.on("double-click", stopEvtPropagation);
  
      // disable zooming out via double-click + Control on the view
      view.on("double-click", ["Control"], stopEvtPropagation);
  
      // disables pinch-zoom and panning on the view
      view.navigation.browserTouchPanEnabled = false;
      view.on("drag", stopEvtPropagation);
  
      // disable the view's zoom box to prevent the Shift + drag
      // and Shift + Control + drag zoom gestures.
      view.on("drag", ["Shift"], stopEvtPropagation);
      view.on("drag", ["Shift", "Control"], stopEvtPropagation);
  
      // prevents zooming and rotation with the indicated keys
      view.on("key-down", function (event) {
        var prohibitedKeys = ["+", "-", "_", "=", "a", "d"];
        var keyPressed = event.key.toLowerCase();
        if (prohibitedKeys.indexOf(keyPressed) !== -1) {
          event.stopPropagation();
        }
      });
  
      return view;
    }
  
    // prevents the user from opening the popup with click
  
    function disablePopupOnClick(view) {
      view.on("click", function (event) {
        event.stopPropagation();
      });
      return view;
    }
  
    //No Code Below This Line
  });
  