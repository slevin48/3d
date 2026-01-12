import { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import World from './Game/World';
import PlayerController from './Game/PlayerController';
import PlacedModel from './Game/PlacedModel';
import MobileControls from './Game/MobileControls';
import { useGame } from '../contexts/GameContext';
import './GameView.css';

function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

export default function GameView({ onBack }) {
  const { savedModels } = useGame();
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });
  const [cameraInput, setCameraInput] = useState({ x: 0, y: 0 });

  const handleJoystickMove = useCallback((input) => {
    setJoystickInput(input);
  }, []);

  const handleCameraRotate = useCallback((input) => {
    setCameraInput(input);
  }, []);

  return (
    <div className="game-container">
      {/* Game HUD */}
      <div className="game-hud">
        <button className="back-btn" onClick={onBack}>
          <span style={{ fontSize: '18px' }}>&#x2190;</span>
          Garage
        </button>
        <div className="player-name">
          <span className="name-tag">BRUCE</span>
        </div>
        <div className="model-count">
          <span>{savedModels.length} models in world</span>
        </div>
      </div>

      {/* Controls help (desktop) */}
      <div className="controls-help">
        <div className="help-item">
          <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Move
        </div>
        <div className="help-item">
          <kbd>Q</kbd><kbd>E</kbd> Rotate camera
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ background: 'linear-gradient(180deg, #87ceeb 0%, #e0f0ff 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />

        {/* Sky */}
        <Sky
          distance={450000}
          sunPosition={[100, 50, 100]}
          inclination={0.5}
          azimuth={0.25}
        />

        <Suspense fallback={<LoadingBox />}>
          {/* World terrain */}
          <World />

          {/* Player (Bruce) */}
          <PlayerController
            joystickInput={joystickInput}
            cameraRotationInput={cameraInput}
          />

          {/* Placed models from garage */}
          {savedModels.map((model) => (
            <PlacedModel key={model.id} modelData={model} />
          ))}
        </Suspense>
      </Canvas>

      {/* Mobile controls overlay */}
      <MobileControls
        onJoystickMove={handleJoystickMove}
        onCameraRotate={handleCameraRotate}
      />
    </div>
  );
}
