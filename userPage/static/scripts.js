const getLocationButton = document.getElementById('get-location');
const locationInput = document.getElementById('location');

// ✅ Function to Get Location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Reverse Geocode: Convert lat/lng to an address
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        locationInput.value = data.display_name + " - " + latitude + "," + longitude; // Show full address
                    } else {
                        locationInput.value = `Lat: ${latitude}, Lng: ${longitude}`;
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                    locationInput.value = `Lat: ${latitude}, Lng: ${longitude}`;
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                locationInput.value = "Location not available";
            }
        );
    } else {
        locationInput.value = "Geolocation not supported";
    }
}

// ✅ Automatically detect location when page loads
// window.onload = () => {
//     getUserLocation();
// };

// ✅ Manually trigger location detection
getLocationButton.addEventListener('click', getUserLocation);