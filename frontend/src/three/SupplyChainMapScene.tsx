import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Line, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

const Node = ({ position, label, color = '#00d2ff' }: { position: [number, number, number], label: string, color?: string }) => {
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.2, 32, 32]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </Sphere>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.2}
          color="white"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Float>
      {/* Glow Aura */}
      <Sphere args={[0.4, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.05} />
      </Sphere>
    </group>
  );
};

export const SupplyChainMapScene = () => {
  const groupRef = useRef<THREE.Group>(null!);

  const nodes = useMemo(() => [
    { pos: [-3, 0, 0] as [number, number, number], label: 'Factory' },
    { pos: [0, 1, 0] as [number, number, number], label: 'Main Ledger', color: '#aa3bff' },
    { pos: [3, 0, 0] as [number, number, number], label: 'Retailer', color: '#39ff14' },
    { pos: [0, -2, 0] as [number, number, number], label: 'Consumer', color: '#ffab00' },
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {nodes.map((node, i) => (
        <Node key={i} position={node.pos} label={node.label} color={node.color} />
      ))}

      {/* Connection Lines */}
      <Line
        points={[[-3, 0, 0], [0, 1, 0], [3, 0, 0], [0, -2, 0], [-3, 0, 0]]}
        color="#ffffff"
        lineWidth={0.5}
        transparent
        opacity={0.2}
      />
      
      {/* Animated Data Particles */}
      <DataParticles />
    </group>
  );
};

const DataParticles = () => {
    const points = useMemo(() => {
        const p = new Float32Array(100 * 3);
        for(let i=0; i<100; i++) {
            p[i*3] = (Math.random() - 0.5) * 10;
            p[i*3+1] = (Math.random() - 0.5) * 10;
            p[i*3+2] = (Math.random() - 0.5) * 10;
        }
        return p;
    }, []);

    const ref = useRef<THREE.Points>(null!);
    useFrame((state) => {
        ref.current.rotation.y += 0.002;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length / 3}
                    array={points}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#00d2ff" transparent opacity={0.4} />
        </points>
    );
};
