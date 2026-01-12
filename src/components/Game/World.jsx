import { useState } from 'react';

// Minecraft-style colors
const COLORS = {
  grass: '#5b8731',
  grassSide: '#8b6914',
  dirt: '#8b6914',
  stone: '#7f7f7f',
  wood: '#6b4423',
  leaves: '#2d5a1b',
};

// Tree made of blocks
function Tree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`trunk-${i}`} position={[0, i + 0.5, 0]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={COLORS.wood} flatShading />
        </mesh>
      ))}
      {/* Leaves */}
      {[-1, 0, 1].map((dx) =>
        [-1, 0, 1].map((dz) =>
          [4, 5].map((dy) => (
            <mesh
              key={`leaf-${dx}-${dz}-${dy}`}
              position={[dx, dy + 0.5, dz]}
              castShadow
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={COLORS.leaves} flatShading />
            </mesh>
          ))
        )
      )}
      {/* Top leaves */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COLORS.leaves} flatShading />
      </mesh>
    </group>
  );
}

// Ground plane with grid pattern
function Ground() {
  const gridSize = 100;

  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshStandardMaterial color={COLORS.grass} flatShading />
      </mesh>

      {/* Grid lines for Minecraft feel */}
      <gridHelper
        args={[gridSize, gridSize, COLORS.grassSide, COLORS.grassSide]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

// Decorative rocks/stones
function Rock({ position, scale = 1 }) {
  return (
    <mesh position={position} castShadow scale={scale}>
      <boxGeometry args={[1, 0.5, 1]} />
      <meshStandardMaterial color={COLORS.stone} flatShading />
    </mesh>
  );
}

// Generate initial random positions (called once outside render)
function generateTreePositions() {
  const positions = [];
  for (let i = 0; i < 15; i++) {
    const x = (Math.random() - 0.5) * 60;
    const z = (Math.random() - 0.5) * 60;
    // Keep trees away from center spawn area
    if (Math.abs(x) > 8 || Math.abs(z) > 8) {
      positions.push([x, 0, z]);
    }
  }
  return positions;
}

function generateRockPositions() {
  const positions = [];
  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 50;
    if (Math.abs(x) > 5 || Math.abs(z) > 5) {
      positions.push({
        pos: [x, 0.25, z],
        scale: 0.5 + Math.random() * 0.5,
      });
    }
  }
  return positions;
}

export default function World() {
  // Generate random positions only once on mount
  const [trees] = useState(generateTreePositions);
  const [rocks] = useState(generateRockPositions);

  return (
    <group>
      <Ground />

      {/* Trees */}
      {trees.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
      ))}

      {/* Rocks */}
      {rocks.map((rock, i) => (
        <Rock key={`rock-${i}`} position={rock.pos} scale={rock.scale} />
      ))}

      {/* Ambient environment */}
      <fog attach="fog" args={['#87ceeb', 30, 80]} />
    </group>
  );
}
