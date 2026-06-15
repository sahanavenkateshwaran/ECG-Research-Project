// import React, { useState } from 'react';
// import axios from 'axios';
// import ImageUpload from './components/ImageUpload';
// import PredictionResult from './components/PredictionResult';
// import { Activity } from 'lucide-react';

// function App() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleImageSelect = (file) => {
//     setSelectedImage(file);
//     setPrediction(null);
//     setError(null);
//   };

//   const handlePredict = async () => {
//     if (!selectedImage) return;

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('image', selectedImage);

//     try {
//       // Connect to MERN Backend
//       const response = await axios.post('http://localhost:5001/api/predict', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       setPrediction(response.data.prediction);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || 'Failed to connect to the server.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <header className="header">
//         <h1>ECG AI Diagnosis</h1>
//         <p>Powered by HybridCapsSwin PyTorch Model</p>
//       </header>

//       <main className="main-content">
//         <div className="upload-section">
//           <ImageUpload 
//             onImageSelect={handleImageSelect} 
//             selectedImage={selectedImage}
//           />
          
//           {error && (
//             <div style={{ color: 'var(--danger)', marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
//               ⚠️ {error}
//             </div>
//           )}

//           <button 
//             className="btn-primary" 
//             onClick={handlePredict}
//             disabled={!selectedImage || loading}
//           >
//             {loading ? (
//               <>
//                 <div className="spinner"></div>
//                 Analyzing...
//               </>
//             ) : (
//               <>
//                 <Activity size={20} />
//                 Run AI Diagnosis
//               </>
//             )}
//           </button>
//         </div>

//         <div className="result-section">
//           <PredictionResult prediction={prediction} />
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import axios from 'axios';
// import ImageUpload from './components/ImageUpload';
// import PredictionResult from './components/PredictionResult';
// import { Activity } from 'lucide-react';

// function App() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleImageSelect = (file) => {
//     setSelectedImage(file);
//     setPrediction(null);
//     setError(null);
//   };

//   const handlePredict = async () => {
//     if (!selectedImage) return;

//     setLoading(true);
//     setError(null);
//     setPrediction(null);

//     const imgElement = document.createElement('img');
//     imgElement.src = URL.createObjectURL(selectedImage);

//     imgElement.onload = async () => {
//       try {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         canvas.width = imgElement.width;
//         canvas.height = imgElement.height;
//         ctx.drawImage(imgElement, 0, 0);

//         const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

//         let darkPixels = 0;
//         let alienColorPixels = 0; 
//         let midTonePixels = 0;
//         let rSum = 0, gSum = 0, bSum = 0;
//         let totalPixels = imgData.length / 4;

//         for (let i = 0; i < imgData.length; i += 4) {
//           const r = imgData[i];
//           const g = imgData[i + 1];
//           const b = imgData[i + 2];

//           rSum += r;
//           gSum += g;
//           bSum += b;

//           if (r < 90 && g < 90 && b < 90) darkPixels++;
//           if (g - r > 25 || b - r > 25 || (g > 120 && b > 120 && r < 100)) alienColorPixels++;

//           const avgPixel = (r + g + b) / 3;
//           if (avgPixel > 50 && avgPixel < 200) midTonePixels++;
//         }

//         const darkPercentage = (darkPixels / totalPixels) * 100;
//         const alienColorPercentage = (alienColorPixels / totalPixels) * 100;
//         const midTonePercentage = (midTonePixels / totalPixels) * 100;
//         const avgBrightness = (rSum + gSum + bSum) / (3 * totalPixels);
        
//         URL.revokeObjectURL(imgElement.src);

//         if (avgBrightness < 160 || darkPercentage > 10 || alienColorPercentage > 1.5 || midTonePercentage > 45) {
//           setError("Invalid Image: Please upload a clean ECG waveform chart.");
//           setLoading(false);
//           return;
//         }

//         // 🚀 THE FIX 1: Send the image with the exact key 'file'
//         const formData = new FormData();
//         formData.append('file', selectedImage); 

//         const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });

//         // 🚀 THE FIX 2: Set the prediction directly from response.data
//         setPrediction(response.data);

//       } catch (err) {
//         console.error(err);
//         setError("Could not connect to the Python AI Engine. Please make sure app.py is running in your terminal on port 5000.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     imgElement.onerror = () => {
//       setError("Failed to parse image file data format securely.");
//       setLoading(false);
//     };
//   };

//   return (
//     <div className="app-container">
//       <header className="header">
//         <h1>ECG AI Diagnosis</h1>
//         <p>Powered by HybridCapsSwin PyTorch Model</p>
//       </header>

//       <main className="main-content">
//         <div className="upload-section">
//           <ImageUpload 
//             onImageSelect={handleImageSelect} 
//             selectedImage={selectedImage}
//           />
          
//           {error && (
//             <div style={{ 
//               color: '#ef4444', 
//               marginTop: '1rem', 
//               padding: '1rem', 
//               background: 'rgba(239, 68, 68, 0.1)', 
//               borderRadius: '8px',
//               border: '1px solid rgba(239, 68, 68, 0.2)',
//               fontSize: '14px',
//               fontWeight: '500'
//             }}>
//               ⚠️ {error}
//             </div>
//           )}

//           <button 
//             className="btn-primary" 
//             onClick={handlePredict}
//             disabled={!selectedImage || loading}
//           >
//             {loading ? (
//               <>
//                 <div className="spinner"></div>
//                 Analyzing...
//               </>
//             ) : (
//               <>
//                 <Activity size={20} />
//                 Run AI Diagnosis
//               </>
//             )}
//           </button>
//         </div>

//         <div className="result-section">
//           <PredictionResult prediction={prediction} />
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from './components/ImageUpload';
import PredictionResult from './components/PredictionResult';
import { Activity } from 'lucide-react';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setPrediction(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setPrediction(null);

    const imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(selectedImage);

    imgElement.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        ctx.drawImage(imgElement, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let colorfulPixels = 0;
        let darkPixels = 0;
        let blueGreenPixels = 0;
        let totalPixels = imgData.length / 4;

        // 🚀 THE ULTRA-STRICT ECG SCANNER
        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          // 1. INSTANT FAILURE: Real ECGs NEVER use Blue or Green ink.
          if ((b > r + 15 && b > g + 15) || (g > r + 15 && g > b + 15)) {
            blueGreenPixels++;
          }

          // 2. Is it white/very light paper? (Pass)
          if (r > 200 && g > 200 && b > 200) continue;

          // 3. Is it a dark trace line? (Pass)
          if (r < 100 && g < 100 && b < 100) {
            darkPixels++;
            continue;
          }

          // 4. Is it the pink/red ECG grid? (Pass)
          if (r > 150 && g > 100 && b > 100 && r > g + 15 && r > b + 15) continue;

          // Anything else counts as foreign!
          colorfulPixels++;
        }

        const colorfulPercentage = (colorfulPixels / totalPixels) * 100;
        const darkPercentage = (darkPixels / totalPixels) * 100;
        const blueGreenPercentage = (blueGreenPixels / totalPixels) * 100;
        
        URL.revokeObjectURL(imgElement.src);

        // 🛑 THE STEEL TRAP
        if (blueGreenPercentage > 0.1 || colorfulPercentage > 1.5 || darkPercentage > 15) {
          setError(`Invalid Image: UI/Text Screenshot Detected. (Alien Colors: ${blueGreenPercentage.toFixed(2)}%, Mid-tones: ${colorfulPercentage.toFixed(2)}%)`);
          setLoading(false);
          return;
        }

        // Send the image to Python backend (Port 5000)
        const formData = new FormData();
        formData.append('file', selectedImage); 

        const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Update the UI with real AI data
        setPrediction(response.data);

      } catch (err) {
        console.error(err);
        setError("Could not connect to the Python AI Engine. Please make sure app.py is running in your terminal on port 5000.");
      } finally {
        setLoading(false);
      }
    };

    imgElement.onerror = () => {
      setError("Failed to parse image file data format securely.");
      setLoading(false);
    };
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>ECG AI Diagnosis</h1>
        <p>Powered by HybridCapsSwin PyTorch Model</p>
      </header>

      <main className="main-content">
        <div className="upload-section">
          <ImageUpload 
            onImageSelect={handleImageSelect} 
            selectedImage={selectedImage}
          />
          
          {error && (
            <div style={{ 
              color: '#ef4444', 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button 
            className="btn-primary" 
            onClick={handlePredict}
            disabled={!selectedImage || loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Activity size={20} />
                Run AI Diagnosis
              </>
            )}
          </button>
        </div>

        <div className="result-section">
          <PredictionResult prediction={prediction} />
        </div>
      </main>
    </div>
  );
}

export default App;