import torch
import torch.nn as nn
import torch.nn.functional as F
import timm
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
from torchvision import transforms
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ==========================================
# 0. MONGODB DATABASE SETUP
# ==========================================
load_dotenv()
# Defaults to your local Compass database
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/")
try:
    client = MongoClient(MONGO_URI)
    db = client['ecg_app']
    predictions_collection = db['predictions']
    print("✅ Successfully connected to local MongoDB!")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")


# ==========================================
# 1. ARCHITECTURE DEFINITION (MUST MATCH COLAB)
# ==========================================
class CapsuleLayer(nn.Module):
    def __init__(self, n, i, o, num_iter=3):
        super().__init__()
        self.num_caps, self.out_dim, self.num_iter = n, o, num_iter
        self.W = nn.Parameter(0.01 * torch.randn(1, 49, n, o, i))
    def forward(self, x):
        u = torch.matmul(self.W.repeat(x.size(0), 1, 1, 1, 1), x.unsqueeze(2).unsqueeze(-1))
        b = torch.zeros(x.size(0), 49, self.num_caps, 1, 1).to(x.device)
        for i in range(self.num_iter):
            c = F.softmax(b, dim=2)
            s = (c * u).sum(dim=1, keepdim=True)
            v = (s**2).sum(dim=-1, keepdim=True)/(1+(s**2).sum(dim=-1, keepdim=True)) * (s/torch.sqrt((s**2).sum(dim=-1, keepdim=True) + 1e-9))
            if i < self.num_iter - 1: b += (u * v).sum(dim=3, keepdim=True)
        return v.squeeze(1).squeeze(-1)

class HybridCapsSwin(nn.Module):
    def __init__(self, num_classes=4):
        super().__init__()
        self.swin = timm.create_model('swin_tiny_patch4_window7_224', pretrained=False)
        self.swin.head = nn.Identity()
        self.dropout = nn.Dropout(0.5)
        self.caps = CapsuleLayer(num_classes, 768, 16)
        self.fc = nn.Linear(16, num_classes)
    def forward(self, x):
        x = self.swin.forward_features(x).reshape(x.size(0), 49, 768)
        x = self.caps(self.dropout(x))
        return self.fc(x.mean(dim=1))

# ==========================================
# 2. MODEL LOADING
# ==========================================
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
CLASS_NAMES = ['MI', 'History MI', 'Abnormal HB', 'Normal'] 
model = HybridCapsSwin(num_classes=4).to(DEVICE)
model.load_state_dict(torch.load("hybrid_capsswin.pth", map_location=DEVICE))
model.eval()

# Image Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# ==========================================
# 3. API ROUTE
# ==========================================
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    img = Image.open(io.BytesIO(file.read())).convert('RGB')
    img = transform(img).unsqueeze(0).to(DEVICE)
    
    with torch.no_grad():
        outputs = model(img)
        probs = F.softmax(outputs, dim=1)
        conf, pred = torch.max(probs, 1)
        
    # Standard JSON to send back to the React UI
    result = {
        "class": CLASS_NAMES[pred.item()],
        "confidence": round(conf.item() * 100, 2)
    }
    
    # Save exact schema format to MongoDB
    db_record = {
        "originalFilename": file.filename,
        "predictedClassId": pred.item(),
        "predictedClassName": CLASS_NAMES[pred.item()],
        "confidence": round(conf.item() * 100, 2),
        "createdAt": datetime.utcnow()
    }
    
    try:
        predictions_collection.insert_one(db_record)
        print(f"📁 Saved prediction to DB: {file.filename}")
    except Exception as e:
        print(f"⚠️ Failed to save to database: {e}")

    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=True)