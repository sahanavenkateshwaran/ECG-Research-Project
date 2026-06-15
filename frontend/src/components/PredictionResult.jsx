// import React, { useEffect, useState } from 'react';
// import { Activity } from 'lucide-react';

// const PredictionResult = ({ prediction }) => {
//   const [dashOffset, setDashOffset] = useState(502); // 2 * PI * 80 (radius) approx 502

//   useEffect(() => {
//     if (prediction && prediction.confidence) {
//       // Calculate offset based on percentage
//       const circumference = 2 * Math.PI * 80; // r=80 in our SVG
//       const offset = circumference - (prediction.confidence / 100) * circumference;
      
//       // Small timeout to allow CSS transition to happen
//       setTimeout(() => {
//         setDashOffset(offset);
//       }, 100);
//     }
//   }, [prediction]);

//   if (!prediction) {
//     return (
//       <div className="glass-panel" style={{ height: '100%' }}>
//         <div className="result-placeholder">
//           <Activity className="result-icon" />
//           <h3>Awaiting Prediction</h3>
//           <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
//             Upload an ECG image and click "Predict" to see the AI analysis results here.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="glass-panel" style={{ height: '100%' }}>
//       <h2 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: '600', textAlign: 'center' }}>
//         Analysis Complete
//       </h2>
      
//       <div className="result-card">
//         <div className="confidence-ring-container">
//           <svg className="confidence-ring" viewBox="0 0 180 180">
//             <defs>
//               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#60a5fa" />
//                 <stop offset="100%" stopColor="#a78bfa" />
//               </linearGradient>
//             </defs>
//             <circle 
//               className="ring-bg" 
//               cx="90" cy="90" r="80" 
//             />
//             <circle 
//               className="ring-fill" 
//               cx="90" cy="90" r="80" 
//               strokeDasharray="502"
//               strokeDashoffset={dashOffset}
//             />
//           </svg>
//           <div className="confidence-text">
//             <div className="confidence-value">{Math.round(prediction.confidence)}%</div>
//             <div className="confidence-label">Confidence</div>
//           </div>
//         </div>

//         <div className="class-result">
//           <div className="class-label">Predicted Classification</div>
//           <div className="class-name">{prediction.class_name}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PredictionResult;

// import React, { useEffect, useState } from 'react';
// import { AlertTriangle, Activity } from 'lucide-react';

// const PredictionResult = ({ prediction }) => {
//   const [dashOffset, setDashOffset] = useState(502);
//   const radius = 80;
//   const circumference = 2 * Math.PI * radius;

//   // 1. Data Mapping: Ensure the key matches exactly what Python returns
//   // If prediction is null/undefined, handle gracefully
//   const aiClass = prediction?.class || "Unknown";
//   const confidence = prediction?.confidence || 0;

//   const LABEL_MAP = {
//     "Normal": { text: "Normal Person ECG", color: "#10b981" }, // Emerald-500
//     "MI": { text: "Myocardial Infarction Detected", color: "#ef4444" }, // Red-500
//     "History MI": { text: "History of Myocardial Infarction", color: "#f59e0b" }, // Amber-500
//     "Abnormal HB": { text: "Abnormal Heartbeat Detected", color: "#ef4444" } // Red-500
//   };

//   const displayConfig = LABEL_MAP[aiClass] || { text: aiClass, color: "#64748b" };

//   useEffect(() => {
//     // Calculate gauge offset based on real confidence
//     const offset = circumference - (confidence / 100) * circumference;
//     const timeoutId = setTimeout(() => {
//       setDashOffset(offset);
//     }, 100);
//     return () => clearTimeout(timeoutId);
//   }, [confidence, circumference]);

//   if (!prediction) return null;

//   return (
//     <div className="mt-4 p-6 w-full max-w-md mx-auto flex flex-col items-center justify-center text-center">
      
//       {/* Header Container */}
//       <div className="flex flex-col items-center justify-center w-full mb-4">
//         <div className="flex items-center justify-center gap-2 mb-1">
//           <Activity className="w-5 h-5" style={{ color: displayConfig.color }} />
//           <h3 className="text-sm font-bold text-slate-300 tracking-wide">ECG Analysis Result</h3>
//         </div>
//         <div className="text-[15px] font-medium py-2 px-4 rounded-lg border shadow-inner mt-2"
//              style={{ 
//                color: displayConfig.color, 
//                borderColor: `${displayConfig.color}40`, 
//                backgroundColor: "rgba(15, 23, 42, 0.7)" 
//              }}>
//           {displayConfig.text}
//         </div>
//       </div>

//       {/* Circle Gauge Container */}
//       <div className="relative flex justify-center items-center my-2 h-48 w-48 mx-auto">
//         <svg className="w-48 h-48 transform -rotate-90">
//           <circle cx="96" cy="96" r={radius} stroke="#1e293b" strokeWidth="12" fill="transparent"/>
//           <circle 
//             cx="96" cy="96" r={radius} 
//             stroke={displayConfig.color} 
//             strokeWidth="12" 
//             fill="transparent"
//             strokeDasharray={circumference} 
//             strokeDashoffset={dashOffset} 
//             strokeLinecap="round"
//             className="transition-all duration-1000 ease-out"
//           />
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//           <span className="text-3xl font-black text-slate-100">{Math.round(confidence)}%</span>
//           <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">
//             Confidence
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PredictionResult;

import React from 'react';

const PredictionResult = ({ prediction }) => {
  if (!prediction) return null;

  // Extract the data from your Python backend
  const confidence = prediction.confidence;
  const resultClass = prediction.class;

  // Set colors: Green for Normal, Red for issues
  const isNormal = resultClass === 'Normal';
  const themeColor = isNormal ? '#10b981' : '#ef4444'; // Tailwind Green and Red
  const trackColor = 'rgba(255, 255, 255, 0.1)';

  // SVG Circle Math for a FULL circle
  const size = 160;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className="prediction-container" style={{ textAlign: 'center', padding: '1rem' }}>
      
      {/* Header */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.2rem' }}>
        <span style={{ marginRight: '8px', color: themeColor }}>∿</span>
        ECG Analysis Result
      </h2>
      <p style={{ fontSize: '1.2rem', color: themeColor, marginBottom: '2rem' }}>
        {resultClass}
      </p>

      {/* Full Circle Progress Bar */}
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
        <svg 
          width={size} 
          height={size} 
          // Rotate -90deg so the progress starts exactly at the top (12 o'clock)
          style={{ transform: 'rotate(-90deg)' }} 
        >
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          
          {/* Active Progress */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={themeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} // Smooth animation
          />
        </svg>
      </div>

      {/* Text strictly BELOW the circle */}
      <div style={{ marginTop: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>
          {confidence}%
        </span>
        <span style={{ fontSize: '1.1rem', color: '#9ca3af', marginLeft: '6px' }}>
          Confidence
        </span>
      </div>

    </div>
  );
};

export default PredictionResult;