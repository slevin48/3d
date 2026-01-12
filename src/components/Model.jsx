import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Model({ fileData, onLoad, autoRotate }) {
  const meshRef = useRef();
  const groupRef = useRef();

  const geometry = useMemo(() => {
    if (!fileData) return null;

    try {
      if (fileData.type === '.stl') {
        const loader = new STLLoader();
        const geom = loader.parse(fileData.data);
        geom.computeVertexNormals();
        return { type: 'geometry', data: geom };
      }

      if (fileData.type === '.obj') {
        const loader = new OBJLoader();
        const text = new TextDecoder().decode(fileData.data);
        const obj = loader.parse(text);
        return { type: 'object', data: obj };
      }

      if (fileData.type === '.gltf' || fileData.type === '.glb') {
        return { type: 'gltf', data: fileData.data };
      }
    } catch (error) {
      console.error('Error parsing model:', error);
      return null;
    }

    return null;
  }, [fileData]);

  useEffect(() => {
    if (!geometry || !groupRef.current) return;

    // Clear previous children
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }

    let object;

    if (geometry.type === 'geometry') {
      const material = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.3,
        roughness: 0.6,
        flatShading: false,
      });
      object = new THREE.Mesh(geometry.data, material);
    } else if (geometry.type === 'object') {
      object = geometry.data;
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            metalness: 0.3,
            roughness: 0.6,
          });
        }
      });
    } else if (geometry.type === 'gltf') {
      const loader = new GLTFLoader();
      const arrayBuffer = geometry.data instanceof ArrayBuffer
        ? geometry.data
        : new TextEncoder().encode(geometry.data).buffer;

      loader.parse(arrayBuffer, '', (gltf) => {
        const model = gltf.scene;
        centerAndScaleObject(model);
        groupRef.current.add(model);
        onLoad?.();
      }, (error) => {
        console.error('Error loading GLTF:', error);
      });
      return;
    }

    if (object) {
      centerAndScaleObject(object);
      groupRef.current.add(object);
      onLoad?.();
    }
  }, [geometry, onLoad]);

  const centerAndScaleObject = (object) => {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxDim;

    object.position.sub(center);
    object.scale.multiplyScalar(scale);
  };

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  if (!fileData) return null;

  return <group ref={groupRef} />;
}
