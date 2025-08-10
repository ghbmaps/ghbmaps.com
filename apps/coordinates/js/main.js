require(["esri/views/MapView", "esri/WebMap", "esri/widgets/CoordinateConversion"], (MapView, WebMap, CoordinateConversion) => {
  /************************************************************
   * Creates a new WebMap instance. A WebMap must reference
   * a PortalItem ID that represents a WebMap saved to
   * arcgis.com or an on-premise portal.
   *
   * To load a WebMap from an on-premise portal, set the portal
   * url with esriConfig.portalUrl.
   ************************************************************/
  const webmap = new WebMap({
    portalItem: {
      // autocasts as new PortalItem()
      id: "9ca77e0d348d4df893f1675ea88204e6"
    }
  });

  /************************************************************
   * Set the WebMap instance to the map property in a MapView.
   ************************************************************/
  const view = new MapView({
    map: webmap,
    container: "viewDiv"
  });

  const ccWidget = new CoordinateConversion({
    view: view
  });

  view.ui.add(ccWidget, "top-right");

});
