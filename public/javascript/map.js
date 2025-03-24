mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        //Choose from mapbox's core styles,or make your own style with Mapbox Studio
        style:"mapbox://styles/mapbox/streets-v12",//STYLE URL
        center: listing.geometry.coordinates, // starting position [longitude, latitude].
        zoom: 8, // starting zoom
});
const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 20})
        .setHTML(`<h5>${listing.location}</h5><p>Exact Location Provided after booking</p>`))
        .addTo(map);

        