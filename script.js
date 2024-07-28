document.addEventListener('DOMContentLoaded', function () {
    const reviewButton = document.getElementById('reviewButton');
    const reviewSection = document.getElementById('reviewSection');
    const stars = document.querySelectorAll('.star');
    const ratingDisplay = document.getElementById('rating');
    const submitRatingButton = document.getElementById('submitRating');
    const currentLocationButton = document.getElementById('current-location');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results');

    // Toggle Review Section
    reviewButton.addEventListener('click', () => {
        reviewSection.classList.toggle('hidden');
    });

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            highlightStars(star.dataset.value);
        });

        star.addEventListener('mouseout', () => {
            resetStars();
        });

        star.addEventListener('click', () => {
            selectStars(star.dataset.value);
        });
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            star.classList.toggle('hover', star.dataset.value <= rating);
        });
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('hover');
        });
    }

    function selectStars(rating) {
        stars.forEach(star => {
            star.classList.toggle('selected', star.dataset.value <= rating);
        });
        ratingDisplay.textContent = rating;
    }

    // Mock submit rating
    submitRatingButton.addEventListener('click', () => {
        alert(`Rating submitted: ${ratingDisplay.textContent} stars`);
        reviewSection.classList.add('hidden');
    });

    // Map functionality
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 4,
    });

    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });

    const input = document.getElementById('search-bar');
    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length == 0) return;

        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) return;

            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

// Function to generate random positions within a given radius (in meters) from a center point
function generateRandomPosition(center, radius) {
    const x0 = center.lat;
    const y0 = center.lng;
    const rd = radius / 111300; // about 111300 meters per degree of latitude

    const u = Math.random();
    const v = Math.random();

    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;

    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    // Adjust the x-coordinate for the shrinking of the east-west distances
    const xp = x / Math.cos(y0);

    return {
        lat: x0 + xp,
        lng: y0 + y
    };
}

// Flag to track if markers have been added
let markersAdded = false;

currentLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            map.setCenter(pos);
            map.setZoom(13); // Set the zoom level to zoom into the current location
            marker.setPosition(pos);
            marker.setVisible(true);

            // Check if markers have already been added
            if (!markersAdded) {
                // Generate random petrol pump locations within a 3 km radius of the current location
                const radius = 2000; // radius in meters
                const petrolPumps = [];
                for (let i = 0; i < 5; i++) { // Generate 10 random locations
                    petrolPumps.push(generateRandomPosition(pos, radius));
                }

                // Add markers for random petrol pump locations
                petrolPumps.forEach((pump) => {
                    new google.maps.Marker({
                        position: pump,
                        map,
                        title: 'Petrol Pump',
                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    });
                });

                // Set the flag to true after adding markers
                markersAdded = true;
            }

            await fetchNearbyPlaces('petrol pump', pos.lat, pos.lng);
        }, () => handleLocationError(true, map.getCenter()));
    } else {
        handleLocationError(false, map.getCenter());
    }
});

    const satelliteButton = document.createElement('button');
    satelliteButton.textContent = 'Satellite View';
    satelliteButton.classList.add('view-toggle');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(satelliteButton);

    satelliteButton.addEventListener('click', () => {
        const currentTypeId = map.getMapTypeId();
        map.setMapTypeId(currentTypeId === 'roadmap' ? 'satellite' : 'roadmap');
        satelliteButton.textContent = currentTypeId === 'roadmap' ? 'Roadmap View' : 'Satellite View';
    });

    currentLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                map.setCenter(pos);
                marker.setPosition(pos);
                marker.setVisible(true);
                await fetchNearbyPlaces('petrol pump', `${pos.lat},${pos.lng}`);
            }, () => handleLocationError(true, map.getCenter()));
        } else {
            handleLocationError(false, map.getCenter());
        }
    });

    searchButton.addEventListener('click', () => {
        const places = searchBox.getPlaces();
        if (places.length == 0) return;

        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) return;

            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    // Fetch nearby places using RapidAPI
    async function fetchNearbyPlaces(query, location, radius = 5000) {
        const url = `https://map-places.p.rapidapi.com/queryautocomplete/json?input=${query}&location=${location}&radius=${radius}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'c0213903e8msh1eae9c419e0171cp1b8144jsn754236aa6560',
                'x-rapidapi-host': 'map-places.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            displayResults(result);
        } catch (error) {
            console.error(error);
        }
    }

    // Display the fetched results on the webpage
    function displayResults(results) {
        resultsContainer.innerHTML = '';

        if (results && results.predictions) {
            results.predictions.forEach((place) => {
                const placeElement = document.createElement('div');
                placeElement.textContent = place.description;
                resultsContainer.appendChild(placeElement);
            });
        } else {
            resultsContainer.textContent = 'No results found.';
        }
    }
});