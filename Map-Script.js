document.addEventListener('DOMContentLoaded', function () {

    // Reset toggle buttons to 'off' position at page load
    document.getElementById('toggleBorderOverlay').checked = false;
    document.getElementById('toggleNameOverlay').checked = false;
    document.getElementById('toggleShieldsOverlay').checked = false;
  
    //Small map dimensions
    let mapWidth = 3840;
    let mapHeight = 2160;
  
    // Define bounds of the map based on its height and width
    let bounds = [[0, 0], [mapHeight, mapWidth]];
  
    // Initialize the Leaflet map
    // Map settings 
    var map = L.map('map', {
      attributionControl: false,
      minZoom: -2,
      maxZoom: 2,
      center: [(mapHeight / 2), (mapWidth / 2)],
      zoom: 1,
      crs: L.CRS.Simple,
      zoomControl: false,
      zoomSnap: 0.1, // Allows more granular zoom levels
      wheelPxPerZoomLevel: 50 // Default is 60, increasing it reduces zoom sensitivity
    });
  
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);
  
  
    // ----------------------------------------------------------------------------
    // Map Values Initialization
    // ----------------------------------------------------------------------------
  
    // Initialize the border overlay
    let borderOverlay = initializeOverlay('assets/Maps/map-overlay-borders.png', bounds);
  
    // Initialize the name overlay
    let nameOverlay = initializeOverlay('assets/Maps/map-overlay-names.png', bounds);
  
    // Initialize the Shields overlay
    let shieldsOverlay = initializeOverlay('assets/Maps/map-overlay-shields.png', bounds);
  
    // Dimensions of the map container
    var containerWidth = map.getContainer().offsetWidth;
    var containerHeight = map.getContainer().offsetHeight;
  
    // Set the minimum zoom level
    let minZoom = calculateMinZoom(mapWidth, mapHeight, containerWidth, containerHeight);
    map.setMinZoom(minZoom);
    console.log("Calculated Min Zoom:", minZoom);
  
    // Set maximum bounds to restrict panning outside the map area
    map.setMaxBounds(bounds);
  
    // Fit the map to the specified bounds
    map.fitBounds(bounds);
  
    //Main Image
    L.imageOverlay('assets/Maps/map-base.png', bounds).addTo(map);
  
    // Reset zoom button functionality
    document.getElementById('resetZoomBtn').addEventListener('click', function () {
      map.fitBounds(bounds); // Reset the map view to fit the initial bounds
      console.log("Resets map");
    });
  
    //Border Overlay
    document.getElementById('toggleBorderOverlay').addEventListener('change', function () {
      toggleOverlay(borderOverlay, this.checked);
    });
  
    //Name Overlay
    document.getElementById('toggleNameOverlay').addEventListener('change', function () {
      toggleOverlay(nameOverlay, this.checked);
    });
  
    //Name Overlay
    document.getElementById('toggleShieldsOverlay').addEventListener('change', function () {
      toggleOverlay(shieldsOverlay, this.checked);
    });
  
  
    // ----------------------------------------------------------------------------
    // Map Functions
    // ----------------------------------------------------------------------------
  
    /**
    * Calculates the minimum zoom level to fit the source map within the target container using arrow function syntax.
    * @param {number} sourceWidth Width of the source image.
    * @param {number} sourceHeight Height of the source image.
    * @param {number} targetWidth Width of the target container.
    * @param {number} targetHeight Height of the target container.
    * @returns {number} Calculated minimum zoom level.
    */
    function calculateMinZoom(sourceWidth, sourceHeight, targetWidth, targetHeight) {
      const scaleX = targetWidth / sourceWidth; // Calculate horizontal scale
      const scaleY = targetHeight / sourceHeight; // Calculate vertical scale
      const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit the entire image
      const zoom = Math.log(scale) / Math.log(2); // Convert scale to zoom level
      return zoom; // Return calculated zoom level
    }
  
    /**
   * Refreshes the z-index of overlay layers to ensure proper layer stacking.
   * This function checks if certain layers are present on the map and then
   * sets their z-index values to maintain the visual layering order.
   * The name overlay is always kept on top of the border overlay.
   */
    const refreshOverlayZIndex = () => {
      if (map.hasLayer(nameOverlay)) {
        nameOverlay.getElement().style.zIndex = 500;
      }
      if (map.hasLayer(borderOverlay)) {
        borderOverlay.getElement().style.zIndex = 400;
      }
      if (map.hasLayer(shieldsOverlay)) {
        shieldsOverlay.getElement().style.zIndex = 500;
      }
    }
  
    /**
     * Initializes a Leaflet image overlay with specified settings.
     * @param {string} imageUrl - The URL of the image to use as the overlay.
     * @param {Array<Array<number>>} bounds - The geographical bounds the image overlay will cover.
     * @returns {L.ImageOverlay} The initialized and configured image overlay.
     */
    function initializeOverlay(imageUrl, bounds) {
      let overlay = L.imageOverlay(imageUrl, bounds, {
        opacity: 0,        // Start with opacity set to 0 for a hidden state
        interactive: false // Set interaction based on requirements, false by default
      }).addTo(map);
      overlay._customOpacity = 0; // Custom property to track opacity
      overlay.remove(); // Start with the overlay hidden
      return overlay;
    }
  
    /**
     * Toggles an overlay's visibility with a fade effect.
     * @param {L.ImageOverlay} overlay - The Leaflet image overlay to toggle.
     * @param {boolean} visibilityStatus - True to show the overlay, false to hide it.
     */
    const toggleOverlay = (overlay, visibilityStatus) => {
      if (visibilityStatus) {
        if (!map.hasLayer(overlay)) {
          map.addLayer(overlay);
        }
        overlay.setOpacity(0);  // Start from 0 opacity for a smooth transition
        setTimeout(() => overlay.setOpacity(1), 10);  // Slight delay to ensure CSS transition catches
      } else {
        overlay.setOpacity(0);  // Fade out smoothly
        setTimeout(() => {
          if (overlay.getOpacity() === 0) {  // Check opacity before removing
            map.removeLayer(overlay);
          }
        }, 700);  // Wait for the transition to complete before potentially removing the layer
      }
      refreshOverlayZIndex();  // Refresh z-index after any change to overlay visibility
    }
  
    //END OF MAP FUNCTION
  });