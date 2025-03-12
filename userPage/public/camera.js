const openCameraButton = document.getElementById('open-camera');
const closeCameraButton = document.getElementById('close-camera');
const cameraVideoStream = document.getElementById('camera-stream');
const shutterButton = document.getElementById('shutter');
const imageCountDisplay = document.getElementById('image-count');
const capturedImagesContainer = document.getElementById('captured-images');
const fileInput = document.getElementById('file-input');
// const uploadForm = document.getElementById('upload-form');
const gallery = document.getElementById('gallery-view');
const switchCameraButton = document.getElementById('switch-camera'); // ✅ NEW BUTTON


let stream = null;
let width = window.innerWidth;
let height = 0;
let streaming = false;
let capturedImages = [];
const maxImages = 5;
let currentFacingMode = "user"; //default front camera

// ✅ Open Camera
async function openCamera(facingMode = "user") {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        cameraVideoStream.srcObject = stream;
        cameraVideoStream.style.display = "block"; // Show camera
        openCameraButton.style.display = "none"; // Hide Open button
        closeCameraButton.style.display = "inline-block"; // Show Close button
        shutterButton.style.display = "inline-block"; // Show Capture button
        switchCameraButton.style.display = "inline-block"; // ✅ Show Switch button
        imageCountDisplay.style.display = "block"; // Show Image count
        gallery.style.display = "block"; // Show Gallery
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
}

openCameraButton.addEventListener('click', () => openCamera(currentFacingMode));

// ✅ Switch Camera
switchCameraButton.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === "user" ? "environment" : "user"; // Toggle front/back camera
    if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop current stream
    }
    openCamera(currentFacingMode); // Restart camera with new facing mode
});

// ✅ Close Camera
closeCameraButton.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop stream
        cameraVideoStream.srcObject = null;
        cameraVideoStream.style.display = "none"; // Hide camera
    }
    openCameraButton.style.display = "inline-block"; // Show Open button
    closeCameraButton.style.display = "none"; // Hide Close button
    shutterButton.style.display = "none"; // Hide Capture button
    switchCameraButton.style.display = "none"; // ✅ Hide Switch button
});

// ✅ Adjust video size
cameraVideoStream.addEventListener("canplay", () => {
    if (!streaming) {
        height = cameraVideoStream.videoHeight / (cameraVideoStream.videoWidth / width);
        cameraVideoStream.setAttribute("width", width);
        cameraVideoStream.setAttribute("height", height);
        streaming = true;
    }
});

// ✅ Capture Image
function captureImage() {
    if (!streaming || capturedImages.length >= maxImages) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraVideoStream, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/png');
    capturedImages.push(dataUrl);
    updateGallery();
}

// ✅ Update Gallery
function updateGallery() {
    capturedImagesContainer.innerHTML = "";
    capturedImages.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.alt = `Captured Image ${index + 1}`;
        imgElement.style.width = "100px";
        imgElement.style.margin = "5px";
        capturedImagesContainer.appendChild(imgElement);
    });

    imageCountDisplay.innerText = `Captured: ${capturedImages.length} / ${maxImages}`;
}

// ✅ Convert Data URL to Blob for Upload
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: mimeString });
}

// ✅ Handle Form Submission
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (capturedImages.length === 0) {
        alert("No images captured!");
        return;
    }

    const formData = new FormData();
    capturedImages.forEach((image, index) => {
        formData.append(`image${index}`, dataURItoBlob(image), `image${index}.png`);
    });
});

// ✅ Capture button click
shutterButton.addEventListener('click', captureImage);