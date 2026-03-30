import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Box } from '@react-three/drei';
import * as THREE from 'three';

export const DigitalTwinScene = ({ color = '#00d2ff' }) => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    boxRef.current.rotation.x = t * 0.2;
    boxRef.current.rotation.y = t * 0.3;
    wireframeRef.current.rotation.x = t * 0.2;
    wireframeRef.current.rotation.y = t * 0.3;
    
    // Slight pulsing
    const scale = 1 + Math.sin(t * 2) * 0.05;
    boxRef.current.scale.set(scale, scale, scale);
    wireframeRef.current.scale.set(scale + 0.1, scale + 0.1, scale + 0.1);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={1} />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Box ref={boxRef} args={[1, 1, 1]}>
          <MeshDistortMaterial
            color={color}
            speed={2}
            distort={0.2}
            radius={1}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Box>
        
        <Box ref={wireframeRef} args={[1, 1, 1]}>
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.3}
          />
        </Box>
      </Float>

      {/* Background Particles/Nodes */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.1, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </>
  );
};
