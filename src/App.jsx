import { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import ModelViewer from './components/ModelViewer';
import './App.css';

function App() {
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileLoad = useCallback((data) => {
    setIsLoading(true);
    setFileData(data);
  }, []);

  const handleModelLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleReset = useCallback(() => {
    setFileData(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h1>3D Print Viewer</h1>
        </div>
        {fileData && (
          <button className="reset-btn" onClick={handleReset}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Upload New Model
          </button>
        )}
      </header>

      <main className="main">
        {!fileData ? (
          <FileUpload onFileLoad={handleFileLoad} isLoading={isLoading} />
        ) : (
          <ModelViewer fileData={fileData} onModelLoad={handleModelLoad} />
        )}
      </main>

      <footer className="footer">
        <p>Upload STL, OBJ, GLTF, or GLB files to preview your 3D prints</p>
      </footer>
    </div>
  );
}

export default App;
