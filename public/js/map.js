
    mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });


     const marker = new mapboxgl.Marker()
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset: 25}).setHTML(
                `<h4>${listing.title}</h4><p><i>Exact location will be provided after booking</i></p>`
            )
        )
        .addTo(map);
