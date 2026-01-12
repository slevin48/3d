import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Bruce from './Bruce';

const MOVE_SPEED = 5;
const ROTATION_SPEED = 2;
const CAMERA_DISTANCE = 8;
const CAMERA_HEIGHT = 4;

export default function PlayerController({ joystickInput, cameraRotationInput }) {
  const { camera } = useThree();
  const [position, setPosition] = useState({ x: 0, y: 0, z: 10 });
  const [rotation, setRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const keysPressed = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    rotateLeft: false,
    rotateRight: false,
  });

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressed.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressed.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressed.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressed.current.right = true;
          break;
        case 'KeyQ':
          keysPressed.current.rotateLeft = true;
          break;
        case 'KeyE':
          keysPressed.current.rotateRight = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressed.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressed.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressed.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressed.current.right = false;
          break;
        case 'KeyQ':
          keysPressed.current.rotateLeft = false;
          break;
        case 'KeyE':
          keysPressed.current.rotateRight = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const keys = keysPressed.current;

    // Combine keyboard and joystick input
    let moveX = 0;
    let moveZ = 0;
    let rotationDelta = 0;

    // Keyboard input
    if (keys.forward) moveZ -= 1;
    if (keys.backward) moveZ += 1;
    if (keys.left) moveX -= 1;
    if (keys.right) moveX += 1;
    if (keys.rotateLeft) rotationDelta += ROTATION_SPEED * delta;
    if (keys.rotateRight) rotationDelta -= ROTATION_SPEED * delta;

    // Joystick input (mobile)
    if (joystickInput) {
      moveX += joystickInput.x;
      moveZ -= joystickInput.y;
    }

    // Camera rotation from touch
    if (cameraRotationInput) {
      rotationDelta -= cameraRotationInput.x * 0.02;
    }

    // Normalize diagonal movement
    const moveLength = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (moveLength > 0) {
      moveX /= moveLength;
      moveZ /= moveLength;
    }

    const moving = moveLength > 0.1;
    setIsMoving(moving);

    // Update rotation
    const newRotation = rotation + rotationDelta;
    setRotation(newRotation);

    // Calculate movement direction based on player rotation
    if (moving) {
      const moveDir = new THREE.Vector3(moveX, 0, moveZ);
      moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), newRotation);
      moveDir.multiplyScalar(MOVE_SPEED * delta);

      setPosition((prev) => ({
        x: prev.x + moveDir.x,
        y: prev.y,
        z: prev.z + moveDir.z,
      }));
    }

    // Update camera to follow player (third person)
    const cameraOffset = new THREE.Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), newRotation);

    const targetCameraPos = new THREE.Vector3(
      position.x + cameraOffset.x,
      position.y + cameraOffset.y,
      position.z + cameraOffset.z
    );

    // Smooth camera follow
    camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(position.x, position.y + 1.5, position.z);
  });

  return (
    <Bruce
      position={[position.x, position.y, position.z]}
      rotation={rotation}
      isMoving={isMoving}
    />
  );
}
