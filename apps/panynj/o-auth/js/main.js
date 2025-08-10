require([
  "esri/portal/Portal",
  "esri/identity/OAuthInfo",
  "esri/identity/IdentityManager",
  "esri/portal/PortalQueryParams",
], (Portal, OAuthInfo, esriId, PortalQueryParams) => {
  const personalPanelElement = document.getElementById("personalizedPanel");
  const anonPanelElement = document.getElementById("anonymousPanel");
  const userIdElement = document.getElementById("userId");

  const info = new OAuthInfo({
    // Swap this ID out with registered application ID
    appId: "W2B4LtOMRCRTcllM",
    // Uncomment the next line and update if using your own portal
     portalUrl: "https://geoapps.gis.panynj.gov/portal"
    // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
    // authNamespace: "portal_oauth_inline",
    flowType: "auto", // default that uses two-step flow
    popup: false,
  });
  esriId.registerOAuthInfos([info]);

  // Set the OAuthInfo object similar to what is below if using popups for signing into the application
  /*
  const infoCode = new OAuthInfo({
    // Swap this ID out with registered application ID
    appId: "q244Lb8gDRgWQ8hM",
    // Uncomment the next line and update if using your own portal
    // portalUrl: "https://<host>:<port>/arcgis"
    // Uncomment the next line to prevent the user's signed in state
    // from being shared with other apps on the same domain with
    // the same authNamespace value.
    // authNamespace: "portal_oauth_inline",
    flowType: "authorization-code", // set to this if using a popup for  signing in.
    popup: true,
    popupCallbackUrl: "oauth-callback.html" // page should be relative to application.
    // Make sure it's updated to handle two-step flow
    // see https://github.com/Esri/jsapi-resources/blob/master/oauth/oauth-callback.html for a sample of this.
  });
  */

  esriId
    .checkSignInStatus(info.portalUrl + "/sharing")
    .then(() => {
      displayItems();
    })
    .catch(() => {
      // Anonymous view
      anonPanelElement.style.display = "block";
      personalPanelElement.style.display = "none";
    });

  document.getElementById("sign-in").addEventListener("click", () => {
    // user will be redirected to OAuth Sign In page
    esriId.getCredential(info.portalUrl + "/sharing");
  });

  // Use this snippet instead of the code block above if signing in via a popup
  /*
  document.getElementById("sign-in").addEventListener("click", () => {
    // user will be redirected to OAuth sign-in page
    esriId.getCredential((info.portalUrl + "/sharing"), {
      oAuthPopupConfirmation: false
    }).then(function() {
      displayItems();
    });
  });
  */

  document.getElementById("sign-out").addEventListener("click", () => {
    esriId.destroyCredentials();
    window.location.reload();
  });

  function displayItems() {
    const portal = new Portal();
    // Setting authMode to immediate signs the user in once loaded
    portal.authMode = "immediate";
    // Once loaded, user is signed in
    portal.load().then(() => {
      // Create query parameters for the portal search
      const queryParams = new PortalQueryParams({
        query: "owner:" + portal.user.username,
        sortField: "numViews",
        sortOrder: "desc",
        num: 20,
      });

      userIdElement.innerHTML = portal.user.username;
      anonPanelElement.style.display = "none";
      personalPanelElement.style.display = "block";

      // Query the items based on the queryParams created from portal above
      portal.queryItems(queryParams).then(createGallery);
    });
  }

  function createGallery(items) {
    let htmlFragment = "";

    items.results.forEach((item) => {
      htmlFragment +=
        '<div class="esri-item-container">' +
        (item.thumbnailUrl
          ? '<div class="esri-image" style="background-image:url(' +
            item.thumbnailUrl +
            ');"></div>'
          : '<div class="esri-image esri-null-image">Thumbnail not available</div>') +
        (item.title
          ? '<div class="esri-title">' + (item.title || "") + "</div>"
          : '<div class="esri-title esri-null-title">Title not available</div>') +
        "</div>";
    });
    document.getElementById("itemGallery").innerHTML = htmlFragment;
  }
});
