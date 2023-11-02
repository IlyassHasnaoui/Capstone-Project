document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'AIzaSyBCFu6jCzB4OzkoaMvAMtoKVFi0d0NQYmg'; 
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBCFu6jCzB4OzkoaMvAMtoKVFi0d0NQYmg&libraries=places&callback=initializeMap`;
    document.head.appendChild(script);
});

const searchResults = [];

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
            searchResults.push({
                name: name,
                rating: rating,
            });
        }

        resultsHTML += "</ul>";
        resultsContainer.innerHTML = resultsHTML;
    }
}

document.getElementById("saveResultsButton").addEventListener("click", function () {
    if (searchResults.length > 0) {
        const resultsToSave = searchResults;

        axios.post('/save', resultsToSave)
            .then((response) => {
                console.log('Results saved:', response.data);
                displaySavedResults();
            })
            .catch((error) => {
                console.error('Error saving results:', error);
            });
    } else {
        console.log('No search results to save.');
    }
});

function displaySavedResults() {
    const savedResultsList = document.getElementById('savedResultsList');
    savedResultsList.innerHTML = '';

    axios.get('/saved')
        .then((response) => {
            const savedResults = response.data;

            if (savedResults.length === 0) {
                savedResultsList.innerHTML = 'No saved results found.';
            } else {
                savedResultsList.innerHTML = '<h2>Saved Results</h2>';
                savedResults.forEach((result) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<strong>${result.name}</strong> (Rating: ${result.rating})`;
                    savedResultsList.appendChild(listItem);
                });
            }
        })
        .catch((error) => {
            console.error('Error retrieving saved results:', error);
            savedResultsList.innerHTML = 'Error retrieving saved results.';
        });
}

document.getElementById('savedResultsButton').addEventListener('click', displaySavedResults);

function initializeMap() {
    const mapOptions = {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 15,
    };

    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const service = new google.maps.places.PlacesService(map);

    document.getElementById("searchButton").addEventListener("click", function () {
        const foodType = document.getElementById("foodType").value;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const radiusMiles = parseFloat(document.getElementById("radius").value);
                const radiusMeters = radiusMiles * 1609.34;

                const request = {
                    location: { lat: userLat, lng: userLng },
                    radius: radiusMeters,
                    types: [foodType],
                    minRating: parseFloat(document.getElementById("minRating").value),
                };

                service.nearbySearch(request, function (results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        displayResults(results);
                    } else {
                        console.error("Error: " + status);
                    }
                });
            });
        }
    });
}
