// import React, { useCallback, useState } from 'react';
// import { UploadCloud, X } from 'lucide-react';

// const ImageUpload = ({ onImageSelect, selectedImage }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [preview, setPreview] = useState(null);

//   // If a selectedImage is passed back (or cleared), update preview
//   React.useEffect(() => {
//     if (!selectedImage) {
//       setPreview(null);
//     } else {
//       const objectUrl = URL.createObjectURL(selectedImage);
//       setPreview(objectUrl);
//       return () => URL.revokeObjectURL(objectUrl);
//     }
//   }, [selectedImage]);

//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setIsDragging(true);
//     } else if (e.type === 'dragleave') {
//       setIsDragging(false);
//     }
//   }, []);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   }, []);

//   const handleChange = (e) => {
//     e.preventDefault();
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files[0]);
//     }
//   };

//   const handleFile = (file) => {
//     // Check if it's an image
//     if (!file.type.match('image.*')) {
//       alert('Please select an image file');
//       return;
//     }
//     onImageSelect(file);
//   };

//   const clearImage = (e) => {
//     e.stopPropagation(); // prevent opening file dialog
//     onImageSelect(null);
//   };

//   return (
//     <div className="glass-panel">
//       <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Upload ECG Image</h2>
      
//       {!preview ? (
//         <label 
//           className={`upload-zone ${isDragging ? 'active' : ''}`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handleChange} 
//             style={{ display: 'none' }} 
//           />
//           <UploadCloud className="upload-icon" />
//           <p className="upload-text">Drag & drop your ECG image here</p>
//           <p className="upload-subtext">or click to browse from your computer</p>
//         </label>
//       ) : (
//         <div className="image-preview-container">
//           <img src={preview} alt="ECG Preview" className="image-preview" />
//           <button className="remove-btn" onClick={clearImage} title="Remove image">
//             <X size={16} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;

// const handleFileStandalone = (file, onImageSelect) => {
//     // 1️⃣ Structural Check: Ensure it's an image file format
//     if (!file.type.match('image.*')) {
//       alert('⚠️ Invalid File: Please select a valid image file (.png, .jpg, .jpeg).');
//       return;
//     }

//     // 2️⃣ Heuristic Dimension Check: Detect standard screenshots (e.g., UI windows or mobile frames)
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (event) => {
//       const img = new Image();
//       img.src = event.target.result;
      
//       img.onload = () => {
//         const width = img.width;
//         const height = img.height;
//         const aspectRatio = width / height;

//         // Typical ECG chart images are landscape/square strips (Aspect ratio between 0.6 and 2.5)
//         // Tall smartphone screenshots (e.g., aspect ratio ~0.45) or extreme cinematic desktop captures will fail this gate
//         if (aspectRatio < 0.55 || aspectRatio > 3.0) {
//           alert(
//             "❌ Invalid Image Structure:\n\n" +
//             "This image layout resembles a UI screenshot or a mobile capture rather than an ECG signal segment.\n" +
//             "Please crop the photo tightly around the ECG waveform grid line or upload a cropped signal graph window."
//           );
//           return;
//         }

//         // Catch low-resolution screen scraps
//         if (width < 150 || height < 150) {
//           alert("⚠️ Image Resolution is too low to safely extract wave features. Minimum size is 150x150 pixels.");
//           return;
//         }

//         // All checks passed! Bubble up to Parent component
//         onImageSelect(file);
//       };
//     };
//   };

import React, { useCallback, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

const ImageUpload = ({ onImageSelect, selectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  React.useEffect(() => {
    if (!selectedImage) {
      setPreview(null);
    } else {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('⚠️ Invalid File: Please select a valid image file (.png, .jpg, .jpeg).');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const aspectRatio = img.width / img.height;

        // Block typical tall smartphone screenshots
        if (aspectRatio < 0.55 || aspectRatio > 3.0) {
          alert("❌ Invalid Image: This layout looks like a mobile screenshot. Please upload a standard ECG signal window.");
          return;
        }

        onImageSelect(file);
      };
    };
  };

  const clearImage = (e) => {
    e.stopPropagation(); 
    onImageSelect(null);
  };

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Upload ECG Image</h2>
      
      {!preview ? (
        <label 
          className={`upload-zone ${isDragging ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleChange} 
            style={{ display: 'none' }} 
          />
          <UploadCloud className="upload-icon" />
          <p className="upload-text">Drag & drop your ECG image here</p>
          <p className="upload-subtext">or click to browse from your computer</p>
        </label>
      ) : (
        <div className="image-preview-container">
          <img src={preview} alt="ECG Preview" className="image-preview" />
          <button className="remove-btn" onClick={clearImage} title="Remove image">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;