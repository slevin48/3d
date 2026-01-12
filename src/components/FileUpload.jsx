import { useCallback } from 'react';

const SUPPORTED_FORMATS = ['.stl', '.obj', '.gltf', '.glb'];

export default function FileUpload({ onFileLoad, isLoading }) {
  const processFile = useCallback((file) => {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!SUPPORTED_FORMATS.includes(extension)) {
      alert(`Unsupported format. Please upload: ${SUPPORTED_FORMATS.join(', ')}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileLoad({
        name: file.name,
        type: extension,
        data: e.target.result,
        size: file.size,
      });
    };

    if (extension === '.gltf') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, [onFileLoad]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div
      className="file-upload"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="upload-content">
        <div className="upload-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h2>Upload Your 3D Model</h2>
        <p>Drag and drop your file here, or click to browse</p>
        <p className="formats">Supported formats: STL, OBJ, GLTF, GLB</p>
        <input
          type="file"
          accept=".stl,.obj,.gltf,.glb"
          onChange={handleFileSelect}
          id="file-input"
          disabled={isLoading}
        />
        <label htmlFor="file-input" className="upload-button">
          {isLoading ? 'Loading...' : 'Choose File'}
        </label>
      </div>
    </div>
  );
}
