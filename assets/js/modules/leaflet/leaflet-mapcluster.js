document.addEventListener("DOMContentLoaded", function () {
    const mapElement = document.getElementById("mapcluster");
  
    if (mapElement) {
      try {
        // Parse marker data
        const markersData = JSON.parse(mapElement.getAttribute("data-map-markers"));
        
        // Initialize map
        const map = L.map(mapElement.id).setView([52.377, 4.90], 6); // Default view
        
        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
  
        // Initialize marker cluster group
        const markersCluster = L.markerClusterGroup();
  
        // Add markers to the cluster group
        markersData.forEach(marker => {
          if (marker.lat !== "null" && marker.long !== "null") {
            const popupContent = `
              <strong>${marker.name}</strong><br>
              ${marker.popup}<br>
              <a href="${marker.link}" target="_blank">View Page</a>
            `;
            const markerInstance = L.marker([marker.lat, marker.long]).bindPopup(popupContent);
            markersCluster.addLayer(markerInstance);
          }
        });
  
        // Add cluster group to map
        map.addLayer(markersCluster);
  
        // Adjust map bounds to fit all markers
        if (markersCluster.getBounds().isValid()) {
          map.fitBounds(markersCluster.getBounds(), { padding: [10, 10] });
        }
      } catch (error) {
        console.error("Error initializing Leaflet map:", error);
      }
    }
  });
  