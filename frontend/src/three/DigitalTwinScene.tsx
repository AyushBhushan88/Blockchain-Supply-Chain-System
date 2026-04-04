import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, MeshDistortMaterial, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

export const DigitalTwinScene = ({ color = '#00d2ff' }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
    ringRef.current.rotation.z = t * 0.5;
    
    const scale = 1 + Math.sin(t * 1.5) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color={color} />
      <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={2} />
      
      <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
        {/* Core "Quantum" Sphere */}
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={0.5}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.5}
            clearcoat={1}
            attenuationDistance={0.5}
            attenuationColor={color}
            color={color}
          />
        </Sphere>
        
        {/* Inner Pulsing Core */}
        <Sphere args={[0.4, 32, 32]}>
          <MeshDistortMaterial
            color={color}
            speed={4}
            distort={0.4}
            radius={1}
            emissive={color}
            emissiveIntensity={2}
          />
        </Sphere>

        {/* Orbiting Ring */}
        <Torus ref={ringRef} args={[1.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </Torus>

        {/* Outer Wireframe Hull */}
        <Sphere args={[1.6, 16, 16]}>
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.05}
          />
        </Sphere>
      </Float>

      {/* Volumetric Atmosphere */}
      <mesh scale={10}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
};
