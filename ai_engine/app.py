# -*- coding: utf-8 -*-
"""
AI Engine FastAPI Service
Port: 5000
Endpoint: POST /predict
Model: ResNet50 (best_model.pth)
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image
import io
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Bladder Cancer AI Engine", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# Model configuration
MODEL_PATH = "best_model.pth"
CLASS_NAMES = ["T0", "T1", "T2", "T3"]  # 4 classes ตามโมเดลที่เทรนจริง
NUM_CLASSES = len(CLASS_NAMES)

# Image preprocessing (same as transform_test from training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Global model variable
model = None

def load_model():
    """Load the trained ResNet50 model"""
    global model
    try:
        # Load ResNet50 architecture
        model = models.resnet50(pretrained=False)
        
        # Modify final layer for our number of classes (match training structure)
        num_ftrs = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(num_ftrs, NUM_CLASSES)
        )
        
        # Load trained weights
        if os.path.exists(MODEL_PATH):
            checkpoint = torch.load(MODEL_PATH, map_location=device)
            
            # Handle different checkpoint formats
            if isinstance(checkpoint, dict) and 'state_dict' in checkpoint:
                model.load_state_dict(checkpoint['state_dict'])
            elif isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
                model.load_state_dict(checkpoint['model_state_dict'])
            else:
                model.load_state_dict(checkpoint)
                
            logger.info("Model loaded successfully")
        else:
            logger.warning(f"Model file {MODEL_PATH} not found. Using random weights.")
        
        model = model.to(device)
        model.eval()
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

def preprocess_image(image_bytes):
    """Preprocess image for model inference"""
    try:
        # Open image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        logger.info(f"Image opened: mode={image.mode}, size={image.size}, format={image.format}")
        
        # Convert RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Apply transformations
        image_tensor = transform(image).unsqueeze(0)
        image_tensor = image_tensor.to(device)
        
        # Log tensor statistics for debugging
        logger.info(f"Tensor shape: {image_tensor.shape}, mean: {image_tensor.mean():.4f}, std: {image_tensor.std():.4f}")
        logger.info(f"Tensor min: {image_tensor.min():.4f}, max: {image_tensor.max():.4f}")
        
        return image_tensor
        
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

def predict_image(image_tensor):
    """Make prediction on preprocessed image"""
    try:
        with torch.no_grad():
            outputs = model(image_tensor)
            logger.info(f"Raw model outputs: {outputs}")
            
            probabilities = F.softmax(outputs, dim=1)
            logger.info(f"Softmax probabilities: {probabilities}")
            
            # Get all probabilities for debugging
            all_probs = {cls: f"{prob:.4f}" for cls, prob in zip(CLASS_NAMES, probabilities[0].tolist())}
            logger.info(f"All class probs: {all_probs}")
            
            # Get predicted class and confidence
            confidence, predicted_class = torch.max(probabilities, 1)
            confidence = confidence.item()
            predicted_class = predicted_class.item()
            
            logger.info(f"Predicted class index: {predicted_class}, confidence: {confidence}")
            
            # Map to class name
            stage = CLASS_NAMES[predicted_class]
            confidence_percent = f"{confidence * 100:.2f}%"
            
            return stage, confidence_percent, all_probs
            
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Bladder Cancer AI Engine is running",
        "model": "ResNet50",
        "device": str(device),
        "classes": CLASS_NAMES
    }

@app.get("/health")
async def health_check():
    """Detailed health check with model test"""
    # Test model with random inputs to verify it's working
    test_results = {}
    if model is not None:
        try:
            # Create 3 different random test images
            for i in range(3):
                # Create random noise image with different seed
                torch.manual_seed(i * 100)
                test_tensor = torch.randn(1, 3, 224, 224).to(device)
                
                with torch.no_grad():
                    output = model(test_tensor)
                    probs = F.softmax(output, dim=1)
                    conf, pred_class = torch.max(probs, 1)
                    
                test_results[f"test_{i}"] = {
                    "predicted": CLASS_NAMES[pred_class.item()],
                    "confidence": f"{conf.item():.2%}",
                    "all_probs": {cls: f"{prob:.4f}" for cls, prob in zip(CLASS_NAMES, probs[0].tolist())}
                }
        except Exception as e:
            test_results["error"] = str(e)
    
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device),
        "model_path": MODEL_PATH,
        "num_params": sum(p.numel() for p in model.parameters()) if model else 0,
        "test_predictions": test_results
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict bladder cancer stage from uploaded image
    
    Args:
        file: Image file (jpg, jpeg, png, bmp)
        
    Returns:
        JSON with stage and confidence
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Preprocess image
        image_tensor = preprocess_image(image_bytes)
        
        # Make prediction
        stage, confidence, all_probs = predict_image(image_tensor)
        
        # Return results with full probability breakdown
        result = {
            "stage": stage,
            "confidence": confidence,
            "all_probabilities": all_probs,
            "model": "ResNet50",
            "status": "success"
        }
        
        logger.info(f"FINAL PREDICTION: {stage} ({confidence}) | All probs: {all_probs}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    
    # Load model before starting server
    load_model()
    
    # Start FastAPI server
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=5000,
        reload=False,
        log_level="info"
    )
