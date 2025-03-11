const getLocationButton = document.getElementById('get-location');
const locationInput = document.getElementById('location');
const uploadForm = document.getElementById('upload-form');
console.log("Scripts loaded");
document.getElementById("upload-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default to check if it's firing
    console.log("Submit button clicked");
});
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

uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (capturedImages.length === 0) {
        alert("No images captured!");
        return;
    }

    const formData = new FormData();
    capturedImages.forEach((image, index) => {
        formData.append("images", dataURItoBlob(image), `image${index}.png`);
    });

    // Upload images


    // Send user data
    const userData = {
        // location: document.getElementById("location").value || "Location Unknown",
        descriptionValue: JSON.stringify(document.getElementById("description").value),
        severityValue: JSON.stringify(document.getElementById("severity").value),
        location: JSON.stringify(locationInput.value)
    };
    const uploadResponse = await fetch("/upload", {
        method: "POST",
        body: formData
    });
    const uploadResult = await uploadResponse.json();
    console.log(uploadResult);
    const saveResponse = await fetch("/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    const saveResult = await saveResponse.json();
    console.log(saveResult);
    console.log("User Data Being Sent:", userData);
    alert("Data submitted successfully!");
});
