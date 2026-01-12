import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { base64ToArrayBuffer } from '../../utils/base64';

export default function PlacedModel({ modelData }) {
  const groupRef = useRef();

  const centerAndScaleObject = useCallback((object) => {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim; // Smaller scale for world placement

    object.position.sub(center);
    object.position.y += size.y * scale / 2; // Sit on ground
    object.scale.multiplyScalar(scale);
  }, []);

  useEffect(() => {
    if (!modelData || !groupRef.current) return;

    // Clear previous children
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }

    try {
      const data = base64ToArrayBuffer(modelData.data);
      let object;

      if (modelData.type === '.stl') {
        const loader = new STLLoader();
        const geometry = loader.parse(data);
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({
          color: 0x3b82f6,
          metalness: 0.3,
          roughness: 0.6,
          flatShading: true,
        });
        object = new THREE.Mesh(geometry, material);
      } else if (modelData.type === '.obj') {
        const loader = new OBJLoader();
        const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
        object = loader.parse(text);
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x3b82f6,
              metalness: 0.3,
              roughness: 0.6,
              flatShading: true,
            });
          }
        });
      } else if (modelData.type === '.gltf' || modelData.type === '.glb') {
        const loader = new GLTFLoader();
        const arrayBuffer = data instanceof ArrayBuffer
          ? data
          : new TextEncoder().encode(data).buffer;

        loader.parse(arrayBuffer, '', (gltf) => {
          const model = gltf.scene;
          centerAndScaleObject(model);
          groupRef.current.add(model);
        }, (error) => {
          console.error('Error loading GLTF:', error);
        });
        return;
      }

      if (object) {
        centerAndScaleObject(object);
        groupRef.current.add(object);
      }
    } catch (error) {
      console.error('Error loading placed model:', error);
    }
  }, [modelData, centerAndScaleObject]);

  const { worldPosition, worldRotation, worldScale } = modelData;

  return (
    <group
      ref={groupRef}
      position={[worldPosition.x, worldPosition.y, worldPosition.z]}
      rotation={[0, worldRotation, 0]}
      scale={worldScale}
      castShadow
      receiveShadow
    />
  );
}
