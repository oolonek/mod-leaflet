const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const tile = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

document.querySelectorAll('div.leaflet-map').forEach(map => {
  const viewLat = map.getAttribute('data-leaflet-view-lat')
  const viewLong = map.getAttribute('data-leaflet-view-long')
  const zoom = map.getAttribute('data-leaflet-view-zoom')
  const markersData = map.getAttribute('data-leaflet-markers') // JSON string of markers
  const view = [viewLat, viewLong]

  if (viewLat === null || viewLong === null || zoom === null) {
    console.error('leaflet-map.js: expected lat, long, and zoom')
  } else {
    const bind = L.map(map).setView(view, zoom)
    L.tileLayer(tile, { attribution }).addTo(bind)

    if (markersData) {
      try {
        const markers = JSON.parse(markersData)
        const clusterGroup = L.markerClusterGroup()
        const bounds = L.latLngBounds()

        markers.forEach(marker => {
          const popupContent = `
            <strong>${marker.name}</strong><br>
            ${marker.popup}<br>
            <a href="${marker.link}" target="_blank">View Member Page</a>
          `
          const markerInstance = L.marker([marker.lat, marker.long]).bindPopup(popupContent)
          clusterGroup.addLayer(markerInstance)
          bounds.extend([marker.lat, marker.long])
        })

        bind.addLayer(clusterGroup)

        // Adjust map bounds if markers exist
        if (bounds.isValid()) {
          bind.fitBounds(bounds, { padding: [20, 20] })
        }
      } catch (error) {
        console.error('leaflet-map.js: Failed to parse markers data', error)
      }
    } else {
      // Handle single popup if provided
      const popup = map.getAttribute('data-leaflet-popup-caption')
      const popupLat = map.getAttribute('data-leaflet-popup-lat')
      const popupLong = map.getAttribute('data-leaflet-popup-long')

      if (popup !== null && popupLat !== null && popupLong !== null) {
        L.marker([popupLat, popupLong]).addTo(bind)
          .bindPopup(popup)
          .openPopup()
      }
    }
  }
})
