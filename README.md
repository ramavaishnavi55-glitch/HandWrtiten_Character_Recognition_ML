# Handwritten Character Recognition Web Application

## Project Overview

Build a full-stack AI-powered web application called **Handwritten Character Recognition** that allows users to upload or draw handwritten English alphabet characters and receive real-time predictions from a trained Convolutional Neural Network (CNN).

The backend should use a PyTorch model trained on the EMNIST Letters dataset, while the frontend should provide an intuitive and modern user interface.

The application should demonstrate how Deep Learning and Computer Vision can be deployed in a real-world environment.

---

# Project Goal

Develop a production-ready web application that:

* Accepts handwritten character input.
* Performs image preprocessing automatically.
* Loads a trained CNN model.
* Predicts the alphabet character (A–Z).
* Displays prediction confidence.
* Provides a user-friendly interface.

---

# Target Users

* Students learning AI and Deep Learning.
* Teachers and educators.
* Machine Learning enthusiasts.
* Recruiters reviewing AI portfolio projects.
* General users interested in OCR technology.

---

# AI Model Information

## Model Type

Convolutional Neural Network (CNN)

## Framework

PyTorch

## Dataset

EMNIST Letters Dataset

## Number of Classes

26

```text
A - Z
```

## Input Shape

```text
1 × 28 × 28
```

## Output

```text
26 probabilities
```

Highest probability = predicted character

## Saved Model

```text
character_cnn.pth
```

---

# Application Features

## Feature 1: Upload Character Image

Users can:

* Upload PNG
* Upload JPG
* Upload JPEG

### Validation

Allow only image files.

Maximum size:

```text
5 MB
```

---

## Feature 2: Draw Character

Provide an interactive drawing canvas.

Users should be able to:

* Draw character using mouse
* Draw character using touch screen
* Clear canvas
* Predict character

Canvas size:

```text
280 × 280
```

The backend should resize it to:

```text
28 × 28
```

before prediction.

---

## Feature 3: Real-Time Prediction

After image submission:

1. Image sent to backend
2. Preprocessing applied
3. CNN model loaded
4. Prediction generated
5. Result displayed

---

## Feature 4: Confidence Score

Display:

```text
Predicted Character: A

Confidence: 98.45%
```

Use Softmax probabilities.

---

## Feature 5: Top 3 Predictions

Example:

```text
1. A → 98.45%

2. H → 0.89%

3. R → 0.32%
```

---

# Image Preprocessing Pipeline

The backend must perform:

## Step 1

Convert image to grayscale.

## Step 2

Resize image:

```text
28 × 28
```

## Step 3

Convert image to tensor.

## Step 4

Normalize image.

```python
Normalize((0.5,), (0.5,))
```

## Step 5

Add batch dimension.

```python
image.unsqueeze(0)
```

---

# Backend Requirements

## Framework

Use:

```text
Flask
```

or

```text
FastAPI
```

Preferred:

```text
Flask
```

for simplicity.

---

## API Endpoint

### Predict Character

```http
POST /predict
```

Input:

```json
{
  "image": "uploaded image"
}
```

Output:

```json
{
  "prediction": "A",
  "confidence": 98.45,
  "top_predictions": [
    ["A",98.45],
    ["H",0.89],
    ["R",0.32]
  ]
}
```

---

# Frontend Requirements

## Design Style

Modern AI-themed interface.

Colors:

* White
* Blue
* Purple gradients

Responsive on:

* Desktop
* Tablet
* Mobile

---

# Pages

## Home Page

### Hero Section

Title:

```text
Handwritten Character Recognition
```

Subtitle:

```text
Upload or draw a handwritten character and let AI identify it instantly.
```

Buttons:

```text
Upload Image
Draw Character
```

---

## Prediction Page

Display:

### Uploaded Image

Show image preview.

### Prediction Card

Show:

```text
Predicted Character
Confidence Score
Top Predictions
```

---

## About Project Section

Explain:

* CNN
* EMNIST Dataset
* Deep Learning
* OCR Applications

---

# Model Loading

Load model once during server startup.

Avoid reloading model on every request.

Example:

```python
model = CharacterCNN()
model.load_state_dict(
    torch.load("character_cnn.pth")
)
model.eval()
```

---

# Error Handling

Handle:

## Invalid File

```text
Please upload a valid image.
```

## Empty Canvas

```text
Please draw a character first.
```

## Prediction Failure

```text
Unable to process image.
Please try again.
```

---

# Performance Requirements

Prediction response time:

```text
< 2 seconds
```

Model loaded only once.

Support multiple prediction requests.

---

# Security Requirements

* Validate image uploads.
* Restrict file types.
* Restrict file size.
* Sanitize user input.
* Prevent malicious uploads.

---

# Project Structure

```text
Handwritten-Character-Recognition-WebApp/

│
├── app.py
│
├── model/
│   ├── character_cnn.pth
│   └── model.py
│
├── static/
│   ├── css/
│   ├── js/
│   └── uploads/
│
├── templates/
│   ├── index.html
│   └── result.html
│
├── utils/
│   └── preprocessing.py
│
├── requirements.txt
│
└── README.md
```

---

# Future Enhancements

## Version 2

* Handwritten digit recognition.
* Lowercase alphabet recognition.
* Character sequence recognition.
* Word recognition.
* OCR for sentences.

## Version 3

* Webcam input.
* Real-time camera recognition.
* Mobile application.

---

# Real-World Applications

* OCR Systems
* Document Digitization
* Postal Code Recognition
* Bank Form Processing
* Educational Applications
* Smart Scanning Systems

---

# Expected Outcome

A fully functional AI-powered web application where users can upload or draw handwritten English alphabet characters and receive accurate predictions generated by a CNN model trained on the EMNIST Letters dataset.
