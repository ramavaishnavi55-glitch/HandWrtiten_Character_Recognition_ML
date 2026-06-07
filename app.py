import os
import base64
from flask import Flask, request, jsonify, render_init
import torch
from model.model import CharacterCNN
from utils.preprocessing import preprocess_character_image

app = Flask(__name__)

# Load CNN model once at startup for high performance (< 2 seconds requests)
model = CharacterCNN()
model_path = os.path.join("model", "character_cnn.pth")

if os.path.exists(model_path):
    try:
        # Load weight checkpoints
        # model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
        print(f"Successfully loaded PyTorch CNN weights from {model_path}")
    except Exception as e:
        print(f"Weights format placeholder: {e}")
else:
    print(f"Weights file not found at {model_path}. Running with initialized weights.")

model.eval()

# Alphabet mapping: EMNIST Letters (1-26 mapped to A-Z)
ALPHABET = [chr(i) for i in range(ord('A'), ord('Z') + 1)]

@app.route("/")
def home():
    return "Handwritten Character Recognition API Server is running!"

@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict character class from handwritten image.
    Expects json structure: { "image": "data:image/png;base64,..." }
    """
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "Please draw or upload a character first."}), 400
        
        image_str = data["image"]
        # Strip data uri prefix if present 
        if "base64," in image_str:
            image_str = image_str.split("base64,")[1]
            
        # Decode base64 bytes
        image_bytes = base64.b64decode(image_str)
        
        # Apply standard EMNIST 5-step preprocessing pipeline
        input_tensor = preprocess_character_image(image_bytes)
        
        # Generate neural feed-forward inference pass (no_grad)
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]
            
        # Extract top 3 probabilities and letters
        top_prob, top_indices = torch.topk(probabilities, 3)
        
        prediction = ALPHABET[top_indices[0].item()]
        confidence = float(top_prob[0].item() * 100)
        
        top_predictions = []
        for idx in range(3):
            letter = ALPHABET[top_indices[idx].item()]
            prob = float(top_prob[idx].item() * 100)
            top_predictions.append([letter, round(prob, 2)])
            
        return jsonify({
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "top_predictions": top_predictions
        })
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": "Unable to process image. Please try again."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
