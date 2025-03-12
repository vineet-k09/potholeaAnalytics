// async function getLocality(lat, lng) {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         if (data && data.address) {
//             return (
//                 data.address.neighbourhood ||  // Most local
//                 data.address.suburb ||         // Small locality
//                 data.address.village ||        // Town area
//                 data.address.town ||           // City area
//                 data.address.road ||           // Street name
//                 data.address.city ||           // Last fallback
//                 "Unknown Location"
//             );
//         }
//     } catch (error) {
//         console.error("Error fetching locality:", error);
//     }
//     return "Unknown Location";
// }
document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch('/data');
    const locations = await response.json();

    const map = L.map('map').setView([13.05, 77.5], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const severityColors = {
        "Low": "green",
        "Medium": "yellow",
        "High": "red"
    };

    locations.forEach(location => {
        L.circle([location.lat, location.lng], {
            color: severityColors[location.severity],
            fillColor: severityColors[location.severity],
            fillOpacity: 0.5,
            radius: 500
        }).bindPopup(`<b>${location.description}</b><br>Severity: ${location.severity}`).addTo(map);
    });
});