# 📄 2. model/process.py (Handles model loading & predictions)
import pickle
import numpy as np

# Load the trained model
MODEL_PATH = "model/model.pkl"
with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

# Function to make predictions
def predict(features):
    features = np.array(features).reshape(1, -1)  # Ensure correct shape
    return model.predict(features)[0]
