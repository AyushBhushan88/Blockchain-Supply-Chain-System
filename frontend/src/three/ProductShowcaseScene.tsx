import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Octahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const ProductShowcaseScene = ({ color = '#00d2ff' }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.25;
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2} color={color} />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#aa3bff" />

      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <Octahedron ref={meshRef} args={[1, 0]}>
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={1}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.5}
            clearcoat={1}
            color={color}
          />
        </Octahedron>
        
        {/* Inner Core */}
        <Octahedron args={[0.3, 0]}>
           <MeshDistortMaterial
            color={color}
            speed={5}
            distort={0.5}
            emissive={color}
            emissiveIntensity={3}
          />
        </Octahedron>

        {/* Outer Glow Halo */}
        <Octahedron args={[1.5, 0]}>
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.03}
          />
        </Octahedron>
      </Float>

      {/* Ground Reflection Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.02} />
      </mesh>
    </>
  );
};
