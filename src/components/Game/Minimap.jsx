import { useEffect, useRef } from 'react';
import { useGame } from '../../contexts/GameContext';
import './Minimap.css';

export default function Minimap({ playerPosition, playerRotation }) {
  const { savedModels } = useGame();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const scale = 3; // Scale factor for world coords to minimap pixels
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let i = -50; i <= 50; i += gridSize) {
      const x = centerX + i * scale;
      const y = centerY + i * scale;
      if (x >= 0 && x <= width) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      if (y >= 0 && y <= height) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw center marker
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fillRect(centerX - 1, centerY - 1, 2, 2);

    // Draw models
    savedModels.forEach((model) => {
      const modelX = centerX + model.worldPosition.x * scale;
      const modelZ = centerY + model.worldPosition.z * scale;

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(modelX, modelZ, 3, 0, Math.PI * 2);
      ctx.fill();

      // Outline
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw player (Bruce)
    const playerX = centerX + playerPosition.x * scale;
    const playerZ = centerY + playerPosition.z * scale;

    // Player dot
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(playerX, playerZ, 5, 0, Math.PI * 2);
    ctx.fill();

    // Player outline
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Direction indicator
    const directionLength = 10;
    const dirX = Math.sin(playerRotation) * directionLength;
    const dirZ = Math.cos(playerRotation) * directionLength;

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playerX, playerZ);
    ctx.lineTo(playerX + dirX, playerZ + dirZ);
    ctx.stroke();
  }, [playerPosition, playerRotation, savedModels]);

  return (
    <div className="minimap-container">
      <div className="minimap-title">Map</div>
      <canvas ref={canvasRef} width={150} height={150} />
      <div className="minimap-legend">
        <div className="legend-item">
          <span className="legend-dot player"></span> Bruce
        </div>
        <div className="legend-item">
          <span className="legend-dot model"></span> Models
        </div>
      </div>
    </div>
  );
}
