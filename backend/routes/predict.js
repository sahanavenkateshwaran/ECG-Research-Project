import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
import Prediction from '../models/Prediction.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// AI Microservice URL
const AI_SERVICE_URL = 'http://127.0.0.1:5000/predict';

router.post('/predict', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const filePath = req.file.path;
        
        // Prepare form data to send to Python service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        // Call Python AI Microservice
        console.log(`Sending ${req.file.originalname} to AI service...`);
        const response = await axios.post(AI_SERVICE_URL, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        const aiResult = response.data;

        // Save prediction to MongoDB
        const newPrediction = new Prediction({
            originalFilename: req.file.originalname,
            predictedClassId: aiResult.class_id,
            predictedClassName: aiResult.class_name,
            confidence: aiResult.confidence
        });

        await newPrediction.save();

        // Optionally, delete the uploaded file if we don't want to store it permanently
        // fs.unlinkSync(filePath);

        // Return result to Frontend
        res.json({
            success: true,
            prediction: aiResult,
            dbId: newPrediction._id
        });

    } catch (error) {
        console.error('Prediction Error:', error.message);
        if (error.response) {
            console.error('AI Service Error:', error.response.data);
            res.status(500).json({ error: 'AI Service failed to process the image' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Get Prediction History
router.get('/history', async (req, res) => {
    try {
        const history = await Prediction.find().sort({ createdAt: -1 }).limit(20);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

export default router;
