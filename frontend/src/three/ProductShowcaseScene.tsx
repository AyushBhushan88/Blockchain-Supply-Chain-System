import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

export const ProductShowcaseScene = ({ color = '#00d2ff', active = true }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.4;
    meshRef.current.position.y = Math.sin(t * 1.5) * 0.1;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color={color} />
      <pointLight position={[-10, -10, -10]} color="#ffffff" intensity={1} />
      
      <Environment preset="city" />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 15]} />
          <MeshDistortMaterial
            color={color}
            speed={3}
            distort={0.1}
            radius={1}
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4.5}
      />
    </>
  );
};
