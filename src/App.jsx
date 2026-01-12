import { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import ModelViewer from './components/ModelViewer';
import GameView from './components/GameView';
import { GameProvider, useGame } from './contexts/GameContext';
import './App.css';

function AppContent() {
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { gameMode, setGameMode, savedModels, addModel } = useGame();

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

  const handleSaveToWorld = useCallback(() => {
    if (fileData) {
      addModel(fileData);
      alert(`"${fileData.name}" added to your world!`);
    }
  }, [fileData, addModel]);

  const handleEnterWorld = useCallback(() => {
    setGameMode('world');
  }, [setGameMode]);

  const handleBackToGarage = useCallback(() => {
    setGameMode('garage');
  }, [setGameMode]);

  // Open World Mode
  if (gameMode === 'world') {
    return <GameView onBack={handleBackToGarage} />;
  }

  // Garage Mode (original functionality)
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

        <div className="header-actions">
          {fileData && (
            <>
              <button className="save-btn" onClick={handleSaveToWorld} title="Add to Open World">
                <span style={{ fontSize: '16px' }}>+</span>
                Add to World
              </button>
              <button className="reset-btn" onClick={handleReset}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>&#x21bb;</span>
                New Model
              </button>
            </>
          )}
          <button className="world-btn" onClick={handleEnterWorld}>
            <span style={{ fontSize: '18px' }}>&#x1F30D;</span>
            Open World
            {savedModels.length > 0 && (
              <span className="model-badge">{savedModels.length}</span>
            )}
          </button>
        </div>
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

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
