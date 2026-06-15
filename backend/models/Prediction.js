import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  originalFilename: {
    type: String,
    required: true,
  },
  predictedClassId: {
    type: Number,
    required: true,
  },
  predictedClassName: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Prediction', predictionSchema);
