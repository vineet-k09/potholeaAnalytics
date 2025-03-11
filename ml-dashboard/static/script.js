async function getPrediction() {
    let inputValues = document.getElementById("features").value.split(",");
    let features = inputValues.map(Number);

    const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features })
    });

    const data = await response.json();
    document.getElementById("result").innerText = "Prediction: " + data.prediction;
}