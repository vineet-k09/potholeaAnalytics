# 📄 3. app.py (Flask API to serve predictions & render HTML)
from flask import Flask, request, jsonify, render_template
from model.process import predict

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")  # Serves the dashboard

@app.route("/predict", methods=["POST"])
def predict_api():
    try:
        data = request.json["features"]  # Get input features from frontend
        prediction = predict(data)  # Run model prediction
        return jsonify({"prediction": prediction})  # Return JSON response
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
