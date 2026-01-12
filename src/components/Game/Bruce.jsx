import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Bruce's colors - Minecraft Steve-inspired but unique
const COLORS = {
  skin: '#c9a07a',
  hair: '#3d2314',
  shirt: '#3b82f6', // Blue shirt
  pants: '#1e3a5f',
  shoes: '#2d2d2d',
  eyes: '#ffffff',
  pupils: '#3d2314',
};

export default function Bruce({ position, rotation, isMoving = false }) {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();

  // Walking animation
  useFrame((state) => {
    if (isMoving) {
      const time = state.clock.elapsedTime * 8;
      const swing = Math.sin(time) * 0.5;

      if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing;
    } else {
      // Reset to idle pose
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Head */}
      <group position={[0, 1.7, 0]}>
        {/* Head base */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={COLORS.skin} flatShading />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.52, 0.15, 0.52]} />
          <meshStandardMaterial color={COLORS.hair} flatShading />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 0.05, 0.26]}>
          <boxGeometry args={[0.1, 0.08, 0.02]} />
          <meshStandardMaterial color={COLORS.eyes} flatShading />
        </mesh>
        <mesh position={[0.1, 0.05, 0.26]}>
          <boxGeometry args={[0.1, 0.08, 0.02]} />
          <meshStandardMaterial color={COLORS.eyes} flatShading />
        </mesh>

        {/* Pupils */}
        <mesh position={[-0.1, 0.05, 0.27]}>
          <boxGeometry args={[0.05, 0.05, 0.02]} />
          <meshStandardMaterial color={COLORS.pupils} flatShading />
        </mesh>
        <mesh position={[0.1, 0.05, 0.27]}>
          <boxGeometry args={[0.05, 0.05, 0.02]} />
          <meshStandardMaterial color={COLORS.pupils} flatShading />
        </mesh>
      </group>

      {/* Body/Torso */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.5, 0.75, 0.3]} />
        <meshStandardMaterial color={COLORS.shirt} flatShading />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.35, 1.3, 0]} ref={leftArmRef}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={COLORS.shirt} flatShading />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <boxGeometry args={[0.18, 0.15, 0.18]} />
          <meshStandardMaterial color={COLORS.skin} flatShading />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.35, 1.3, 0]} ref={rightArmRef}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={COLORS.shirt} flatShading />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <boxGeometry args={[0.18, 0.15, 0.18]} />
          <meshStandardMaterial color={COLORS.skin} flatShading />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.12, 0.45, 0]} ref={leftLegRef}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.22, 0.5, 0.25]} />
          <meshStandardMaterial color={COLORS.pants} flatShading />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.45, 0.03]} castShadow>
          <boxGeometry args={[0.22, 0.15, 0.3]} />
          <meshStandardMaterial color={COLORS.shoes} flatShading />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.12, 0.45, 0]} ref={rightLegRef}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.22, 0.5, 0.25]} />
          <meshStandardMaterial color={COLORS.pants} flatShading />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.45, 0.03]} castShadow>
          <boxGeometry args={[0.22, 0.15, 0.3]} />
          <meshStandardMaterial color={COLORS.shoes} flatShading />
        </mesh>
      </group>

      {/* Name tag floating above head */}
      {/* We'll use HTML overlay for the name instead for better rendering */}
    </group>
  );
}
