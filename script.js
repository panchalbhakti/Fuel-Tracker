document.addEventListener('DOMContentLoaded', function () {
    const reviewButton = document.getElementById('reviewButton');
    const reviewSection = document.getElementById('reviewSection');
    const stars = document.querySelectorAll('.star');
    const ratingDisplay = document.getElementById('rating');
    const submitRatingButton = document.getElementById('submitRating');
    const currentLocationButton = document.getElementById('current-location');
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const fuelOptions = document.getElementById('fuel-options');

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
    });



    // Map functionality
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629  },
        zoom: 4
    });

    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29)
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

    currentLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);
                marker.setPosition(pos);
                marker.setVisible(true);
            }, () => {
                handleLocationError(true, map.getCenter());
            });
        } else {
            handleLocationError(false, map.getCenter());
        }
    });

    function handleLocationError(browserHasGeolocation, pos) {
        alert(browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.");
    }

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

    fuelOptions.addEventListener('change', (event) => {
        console.log(`Selected fuel type: ${event.target.value}`);
        // You can add your logic here to handle fuel type changes.
    });
});
