from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
from pathlib import Path

# Load the trained model pipeline

BASE_DIR = Path(__file__).resolve().parent.parent
model = joblib.load(BASE_DIR / "pipeline.pkl")

app = FastAPI(
    title="Body Fat Prediction API",
    description="Predicts body fat percentage using a trained machine learning pipeline.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BodyFatInput(BaseModel):
    Age: int
    Weight: float
    Height: float
    Neck: float
    Chest: float
    Abdomen: float
    Hip: float
    Thigh: float
    Knee: float
    Ankle: float
    Biceps: float
    Forearm: float
    Wrist: float


# Describe what we send back
class PredictionResponse(BaseModel):
    body_fat_percentage: float


@app.get("/")
def read_root():
    return {"message": "Welcome to the Body Fat Prediction API!"}


@app.post("/predict", response_model=PredictionResponse)
def predict_body_fat(input_data: BodyFatInput):
    # Convert input data to a format suitable for the model
    input_df = {
        "Age": [input_data.Age],
        "Weight": [input_data.Weight],
        "Height": [input_data.Height],
        "Neck": [input_data.Neck],
        "Chest": [input_data.Chest],
        "Abdomen": [input_data.Abdomen],
        "Hip": [input_data.Hip],
        "Thigh": [input_data.Thigh],
        "Knee": [input_data.Knee],
        "Ankle": [input_data.Ankle],
        "Biceps": [input_data.Biceps],
        "Forearm": [input_data.Forearm],
        "Wrist": [input_data.Wrist],
    }
    print(input_df)

    # Make prediction
    prediction = model.predict(pd.DataFrame(input_df))
    return PredictionResponse(body_fat_percentage=prediction[0])
