document.addEventListener('DOMContentLoaded', function () {
    const reviewButton = document.getElementById('reviewButton');
    const reviewSection = document.getElementById('reviewSection');
    const stars = document.querySelectorAll('.star');
    const ratingDisplay = document.getElementById('rating');
    const submitRatingButton = document.getElementById('submitRating');
    const currentLocationButton = document.getElementById('current-location');
    const searchButton = document.getElementById('search-button');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const navbar = document.getElementById('navbar');

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        navbar.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Light Mode';
        } else {
            darkModeToggle.textContent = 'Dark Mode';
        }
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



    // Array of dummy petrol pump locations
const petrolPumps = [
    { lat: 23.0225, lng: 72.5714},
    { lat: 23.0330, lng: 72.5254},
    { lat: 23.0734, lng: 72.5261},
    { lat: 23.0694, lng: 72.6315},
    { lat: 23.0396, lng: 72.5660}, 
];

currentLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            map.setCenter(pos);
            map.setZoom(11);
            marker.setPosition(pos);
            marker.setVisible(true);

            petrolPumps.forEach((pump) => {
                new google.maps.Marker({
                    position: pump,
                    map,
                    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    title: 'Petrol Pump',
                });
            });

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
});