import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Center } from '@react-three/drei';
import Model from './Model';

function LoadingSpinner() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

export default function ModelViewer({ fileData, onModelLoad }) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div className="viewer-container">
      <div className="viewer-controls">
        <button
          className={`control-btn ${autoRotate ? 'active' : ''}`}
          onClick={() => setAutoRotate(!autoRotate)}
          title="Auto Rotate"
        >
          <span style={{ fontSize: '20px', lineHeight: 1 }}>&#x21bb;</span>
        </button>
        <button
          className={`control-btn ${showGrid ? 'active' : ''}`}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid"
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>#</span>
        </button>
      </div>

      <div className="model-info">
        <span className="file-name">{fileData.name}</span>
        <span className="file-size">{formatFileSize(fileData.size)}</span>
      </div>

      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        <Suspense fallback={<LoadingSpinner />}>
          <Center>
            <Model
              fileData={fileData}
              onLoad={onModelLoad}
              autoRotate={autoRotate}
            />
          </Center>
        </Suspense>

        {showGrid && (
          <Grid
            infiniteGrid
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#3b82f6"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#60a5fa"
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
            position={[0, -2, 0]}
          />
        )}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
          autoRotate={false}
        />

{/* Environment removed - was causing CORS issues with external HDR files */}
      </Canvas>

      <div className="viewer-instructions">
        <span>Drag to rotate</span>
        <span>Scroll to zoom</span>
        <span>Shift+drag to pan</span>
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
