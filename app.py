from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import joblib

import os
from flask import send_from_directory

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)  # Enable CORS

# Initialize scaler and model
scaler = StandardScaler()
model = None

def train_model():
    global scaler, model
    # Synthetic data generation
    np.random.seed(42)
    X = np.random.normal(size=(1000, 6))
    y = 3.0 + np.random.normal(size=(1000, 1)) * 0.5  # Simulated GPA-like values
    
    # Data preprocessing
    scaler.fit(X)
    
    # Model architecture
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(32, activation='relu', input_shape=(6,)),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(1, activation='linear')
    ])
    
    model.compile(optimizer='adam', loss='mse')
    model.fit(X, y, epochs=50, batch_size=32, verbose=0)
    model.save('model.h5')
    joblib.dump(scaler, 'scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array([
        data['academicLevel'],
        data['aiUsageTime'],
        data['aiDependencyLevel'],
        data['courseDifficulty'],
        data['studyHoursNoAI'],
        data['aiUnderstanding']
    ]).reshape(1, -1)
    
    # Preprocess input
    scaler = joblib.load('scaler.pkl')
    scaled_features = scaler.transform(features)
    
    # Make prediction
    model = tf.keras.models.load_model('model.h5')
    prediction = model.predict(scaled_features)
    
    # Ensure GPA stays within 1.0-5.0 scale
    bounded_gpa = np.clip(prediction[0][0], 1.0, 5.0)
    return jsonify({'predictedGPA': float(bounded_gpa)})

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return "Not Found", 404

if __name__ == '__main__':
    train_model()
    app.run(debug=True)
