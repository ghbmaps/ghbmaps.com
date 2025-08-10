require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Editor"
], (
  WebMap, MapView,
  Editor
) => {

  let pointLayer, lineLayer, polygonLayer;

  // Create a map from the referenced webmap item id
  const webmap = new WebMap({
    portalItem: {
      id: "406f2c3bb914416589c051af695b7c2b"
    }
  });

  const view = new MapView({
    container: "viewDiv",
    map: webmap,
    center:[-71.5, 44],
    zoom: 10
  });

  view.when(() => {
    view.map.loadAll().then(() => {
      view.map.allLayers.forEach((layer) => {
        if (layer.type === 'feature') {
          switch (layer.geometryType) {
            case "polygon":
              polygonLayer = layer;
              break;
            case "polyline":
              lineLayer = layer;
              break;
            case "point":
              pointLayer = layer;
              break;
          }
        }
      });

      // Create layerInfos for layers in Editor. This
      // sets the fields for editing.

      const pointInfos = {
        layer: pointLayer,
        formTemplate: { // autocasts to FormTemplate
          elements: [{ // autocasts to Field Elements
            type: "field",
            fieldName: "HazardType",
            label: "Hazard type"
          }, {
            type: "field",
            fieldName: "Description",
            label: "Description"
          }, {
            type: "field",
            fieldName: "SpecialInstructions",
            label: "Special Instructions"
          }, {
            type: "field",
            fieldName: "Status",
            label: "Status"
          }, {
            type: "field",
            fieldName: "Priority",
            label: "Priority"
          }]
        }
      };


      const lineInfos = {
        layer: lineLayer,
        formTemplate: { // autocasts to FormTemplate
          elements: [{ // autocasts to FieldElement
            type: "field",
            fieldName: "Severity",
            label: "Severity"
          }, {
            type: "field",
            fieldName: "blocktype",
            label: "Type of blockage"
          }, {
            type: "field",
            fieldName: "fullclose",
            label: "Full closure"
        }, {
            type: "field",
            fieldName: "active",
            label: "Active"
          }, {
            type: "field",
            fieldName: "locdesc",
            label: "Location Description"
          }]
        }
      };

      const polyInfos = {
        layer: polygonLayer,
        formTemplate: { // autocasts to FormTemplate
          elements: [{ // autocasts to FieldElement
            type: "field",
            fieldName: "incidenttype",
            label: "Incident Type"
          }, {
            type: "field",
            fieldName: "activeincid",
            label: "Active"
          }, {
            type: "field",
            fieldName: "descrip",
            label: "Description"
          }]
        }
    };

      const editor = new Editor({
        view: view,
        layerInfos: [pointInfos, lineInfos, polyInfos]
    });

    // Add the widget to the view
    view.ui.add(editor, "top-right");
    });
  });
});