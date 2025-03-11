const openCameraButton = document.getElementById('open-camera');
const closeCameraButton = document.getElementById('close-camera');
const cameraVideoStream = document.getElementById('camera-stream');
const shutterButton = document.getElementById('shutter');
const imageCountDisplay = document.getElementById('image-count');
const capturedImagesContainer = document.getElementById('captured-images');
const fileInput = document.getElementById('file-input');
const uploadForm = document.getElementById('upload-form');

let stream = null;
let width = window.innerWidth;
let height = 0;
let streaming = false;
let capturedImages = [];
const maxImages = 5;

// Open Camera
openCameraButton.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraVideoStream.srcObject = stream;
        cameraVideoStream.hidden = false; // Show preview
        openCameraButton.disabled = true;
        closeCameraButton.disabled = false;
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
});

// Close Camera
closeCameraButton.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop the stream
        cameraVideoStream.srcObject = null;
        cameraVideoStream.hidden = true; // Hide preview
        openCameraButton.disabled = false;
        closeCameraButton.disabled = true;
    }
});

// Ensure correct video and canvas size
cameraVideoStream.addEventListener("canplay", () => {
    if (!streaming) {
        height = cameraVideoStream.videoHeight / (cameraVideoStream.videoWidth / width);
        cameraVideoStream.setAttribute("width", width);
        cameraVideoStream.setAttribute("height", height);
        streaming = true;
    }
});

// Capture Image
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

// Update Captured Images Gallery
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

// Attach images to form for upload
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

    console.log("Images ready for upload!", formData);
    alert("Images prepared for upload. Implement backend logic.");
});

// Convert Data URL to Blob for Form Submission
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

// Capture button click event
shutterButton.addEventListener('click', captureImage);
