document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'AIzaSyBCFu6jCzB4OzkoaMvAMtoKVFi0d0NQYmg';
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBCFu6jCzB4OzkoaMvAMtoKVFi0d0NQYmg&libraries=places&callback=initializeMap`;
    document.head.appendChild(script);
});

function initializeMap() {
    const mapOptions = {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 15, };

    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const service = new google.maps.places.PlacesService(map);

//event listener to the search button
    document.getElementById("searchButton").addEventListener("click", function () {

//user-selected filters
    const foodType = document.getElementById("foodType").value;

// Get the user's geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

//type of spot
        const request = {
        location: { lat: userLat, lng: userLng },
        radius: parseInt(document.getElementById("radius").value),
        types: [foodType], //type of place
        minRating: parseFloat(document.getElementById("minRating").value),};

//nearby search
        service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

//filtrd results
        displayResults(results);
        } else {
        console.error("Error: " + status);
    }});
    });
}});
}


function displayResults(results) {
    const resultsContainer = document.getElementById("results");

    if (results.length === 0) {
        resultsContainer.innerHTML = "No results found.";
    } else {
        let resultsHTML = "<h2>Search Results</h2><ul>";

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const name = result.name;
            const rating = result.rating || "N/A";

            resultsHTML += `<li><strong>${name}</strong> (Rating: ${rating})</li>`;
        }

        resultsHTML += "</ul>";
        resultsContainer.innerHTML = resultsHTML;
    }
}
