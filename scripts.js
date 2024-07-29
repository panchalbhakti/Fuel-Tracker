// document.addEventListener('DOMContentLoaded', function(){
//     const navbar = document.getElementById('navbar');
//     const body = document.body;
//     const searchButton = document.getElementById('search-button');
//     const currentLocationButton = document.getElementById('current-location');
//     const darkModeToggle = document.getElementById('darkModeToggle');
//     const stars = document.querySelectorAll('.stars');
//     const reviewButton = document.getElementById('review-button');
//     const reviewSection = document.getElementById('review-section');
//     const ratingDisplay = document.getElementById('rating');
//     const submitRatingButton = document.getElementById('submitRating');
//     const input = document.getElementById('search-bar');
//     const searchBox = new google.maps.places.SearchBox(input);


//     //To toggle dark mode
//     darkModeToggle.addEventListener('click', () => {
//         body.classList.toggle('dark-mode');
//         navbar.classList.toggle('dark-mode');

//         if(body.classList.contains('dark-mode')) {
//             darkModeToggle.textContent = 'Light Mode';
//         }
//         else {
//             darkModeToggle.textContent = 'DarkMode';
//         }
//     });


//     //Map JS
//     const map = new google.maps.Map(document.getElementById('map'), {
//         center: {lat: 20.5937, lng: 78.9629},
//         zoom: 4
//     });

//     const marker = new google.maps.Marker({
//         map, 
//         anchorPoint: new google.maps.Point(0, -29),
//     });

//     //SearchBox 
//     searchBox.addListerner('place_changed', () => {
//         const places = searchBox.getPlaces();
//         if(places.length == 0) return;

//         const bounds = new google.maps.LatLngBounds();
//         places.forEach(place => {
//             if(!place.geometry || !place.geometry.location) return;

//             marker.setPosition(place.geometry.location);
//             marker.setVisible(true);

//             if(place.geometry.viewport){
//                 bounds.union(place.geometry.viewport);
//             } else {
//                 bounds.union(place.geometry.location);
//             }
//         });

//         map.fitBounds(bounds);
//     });

//     //Search Button 
//     searchButton.addEventListener('click', () => {
//         const places = searchBox.getPlaces();
//         if (places.length == 0) return;

//         const bounds = new google.maps.LatLngBounds();
//         places.forEach(place => {
//             if (!place.geometry || !place.geometry.location) return;

//             marker.setPosition(place.geometry.location);
//             marker.setVisible(true);

//             if (place.geometry.viewport) {
//                 bounds.union(place.geometry.viewport);
//             } else {
//                 bounds.extend(place.geometry.location);
//             }
//         });
//         map.fitBounds(bounds);
//     });

//     //Satellite View Button
//     const satelliteButton = document.createElement('button');
//     satelliteButton.textContent = 'Satellite View';
//     satelliteButton.classList.add('view-toggle');
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(satelliteButton);

//     satelliteButton.addEventListener('click', () => {
//         const currentTypeId = map.getMapTypeId();
//         map.setMapTypeId(currentTypeId === 'roadmap' ? 'satellite' : 'roadmap');
//         satelliteButton.textContent = currentTypeId === 'roadmap' ? 'Satellite View' : 'Roadmap View';
//     });

//     //CurrentLocation Button
//     currentLocationButton.addEventListener('click', () => {
//         if(navigator.geolocation){
//             navigator.geolocation.getCurrentPosition(async (position) => {
//                 const pos = { lat: position.coords.latitude, lng: position.coords.longitude};
//                 map.setCenter(pos);
//                 marker.serPosition(pos);
//                 marker.setVisible(true);
//                 await fetchNearbyPlaces('petrol pump', `${pos.lat},${pos.lng}`);
//             }, () => handleLocationError(true, map.getCenter()));
//         } else {
//             handleLocationError(false, map.getCenter());
//         }
//     });

//     //Toggle Review Section
//     reviewButton.addEventListener('click', () => {
//         reviewSection.classList.toggle('hidden');
//     });

//     //Star rating functionality
//     stars.forEach(star => {
//         star.addEventListener('mouseover', () => {
//             highlightStars(star.dataset.value);
//         });

//         star.addEventListener('mouseout', () => {
//             resetStars();
//         });

//         stars.addEventListener('click', () => {
//             selectStars(star.dataset.value);
//         });
//     });

//     function highlightStars(rating) {
//         stars.forEach(star => {
//             star.classList.toggle('hover', star.dataset.value <= rating);
//         });
//     }

//     function resetStars() {
//         stars.forEach(star => {
//             star.classList.remove('hover');
//         });
//     }

//     function selectStars(rating) {
//         stars.forEach(star => {
//             star.classList.toggle('selected', star.dataset.value <= rating);
//         });
//         ratingDisplay.textContent = rating;
//     }

//      //Submit rating
//      submitRatingButton.addEventListener('click', () => {
//         alert(`Rating submitted: ${ratingDisplay.textContent} stars`);
//         reviewSection.classList.add('hidden');
//     });

// });