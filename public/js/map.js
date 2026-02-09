mapboxgl.accessToken = mapToken;

if (!coordinates || coordinates.length !== 2) {
  console.warn("Invalid coordinates");
} else {
  const offsetCenter = [coordinates[0] - 0.01, coordinates[1]];

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: offsetCenter,
    zoom: 12,
  });

  map.addControl(
    new mapboxgl.NavigationControl({ showCompass: false }),
    "top-right"
  );

  map.scrollZoom.disable();

  if (window.innerWidth < 768) {
    map.scrollZoom.enable();
  }

  new mapboxgl.Marker({ color: "#000" })
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        "<strong>Exact location shared after booking</strong>"
      )
    )
    .addTo(map);

  map.flyTo({
    center: offsetCenter,
    zoom: 13,
    speed: 1.2,
    curve: 1,
    essential: true,
  });
}