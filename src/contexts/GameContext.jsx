import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

const STORAGE_KEY = '3d-print-viewer-models';

// Utility functions for ArrayBuffer <-> Base64 conversion
function arrayBufferToBase64(buffer) {
  if (typeof buffer === 'string') return buffer; // Already a string (e.g., GLTF text)
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function loadModelsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load saved models:', e);
  }
  return [];
}

function saveModelsToStorage(models) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
  } catch (e) {
    console.error('Failed to save models:', e);
  }
}

export function GameProvider({ children }) {
  const [gameMode, setGameMode] = useState('garage'); // 'garage' | 'world'
  const [savedModels, setSavedModels] = useState(() => loadModelsFromStorage());
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 10 });
  const [playerRotation, setPlayerRotation] = useState(0);

  const addModel = useCallback((modelData) => {
    const modelWithPosition = {
      id: Date.now(),
      ...modelData,
      // Convert ArrayBuffer to base64 for storage
      data: arrayBufferToBase64(modelData.data),
      worldPosition: {
        x: (Math.random() - 0.5) * 20,
        y: 0,
        z: (Math.random() - 0.5) * 20,
      },
      worldRotation: Math.random() * Math.PI * 2,
      worldScale: 1,
    };
    setSavedModels(prev => {
      const newModels = [...prev, modelWithPosition];
      saveModelsToStorage(newModels);
      return newModels;
    });
    return modelWithPosition;
  }, []);

  const removeModel = useCallback((modelId) => {
    setSavedModels(prev => {
      const newModels = prev.filter(m => m.id !== modelId);
      saveModelsToStorage(newModels);
      return newModels;
    });
  }, []);

  const clearAllModels = useCallback(() => {
    setSavedModels([]);
    saveModelsToStorage([]);
  }, []);

  const value = {
    gameMode,
    setGameMode,
    savedModels,
    addModel,
    removeModel,
    clearAllModels,
    playerPosition,
    setPlayerPosition,
    playerRotation,
    setPlayerRotation,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
