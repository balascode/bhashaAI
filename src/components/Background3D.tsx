import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import * as THREE from "three";

// Floating particles that represent data streams
interface FloatingParticlesProps {
  count?: number;
  color: string;
}

const FloatingParticles = ({ count = 300, color }: FloatingParticlesProps) => {
    const mesh = useRef<THREE.Points>(null);
    const positions = useRef<number[][]>([]);
    const speeds = useRef<number[][]>([]);
  
    useEffect(() => {
      const newPositions: number[][] = [];
      const newSpeeds: number[][] = [];
  
      for (let i = 0; i < count; i++) {
        newPositions.push([
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
        ]);
  
        newSpeeds.push([
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
        ]);
      }
  
      positions.current = newPositions;
      speeds.current = newSpeeds;
  
      const positionArray = new Float32Array(newPositions.flat());
  
      if (mesh.current) {
        mesh.current.geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positionArray, 3)
        );
      }
    }, [count]);
  
    useFrame(() => {
      if (!mesh.current || !positions.current.length) return;
  
      const pos = positions.current;
      const spd = speeds.current;
      const positionAttribute = mesh.current.geometry.getAttribute('position');
  
      for (let i = 0; i < count; i++) {
        pos[i][0] += spd[i][0];
        pos[i][1] += spd[i][1];
        pos[i][2] += spd[i][2];
  
        if (Math.abs(pos[i][0]) > 15) pos[i][0] *= -0.9;
        if (Math.abs(pos[i][1]) > 15) pos[i][1] *= -0.9;
        if (Math.abs(pos[i][2]) > 15) pos[i][2] *= -0.9;
  
        positionAttribute.setXYZ(i, pos[i][0], pos[i][1], pos[i][2]);
      }
  
      positionAttribute.needsUpdate = true;
    });
  
    return (
      <points ref={mesh}>
        <bufferGeometry />
        <pointsMaterial
          size={0.3}
          color={color}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
    );
  };
  

// Data Grid effect
interface DataGridProps {
  color: string;
  lineWidth?: number;
}

const DataGrid = ({ color, lineWidth = 0.03 }: DataGridProps) => {
  const gridSize = 20;
  const gridDivisions = 10;

  return (
    <group>
      <gridHelper
        args={[gridSize, gridDivisions, color, color]}
        position={[0, -8, 0]}
        rotation={[0, 0, 0]}
      >
        <lineBasicMaterial
          attach="material"
          color={color}
          transparent
          opacity={0.2}
          linewidth={lineWidth}
        />
      </gridHelper>
    </group>
  );
};

// Pulsating spheres
interface PulsatingSphereProps {
  position: [number, number, number];
  color: string;
  pulseSpeed?: number;
  size?: number;
}

const PulsatingSphere = ({ position, color, pulseSpeed = 1, size = 1 }: PulsatingSphereProps) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;

    const pulse = Math.sin(clock.getElapsedTime() * pulseSpeed) * 0.1 + 0.9;
    mesh.current.scale.set(pulse * size, pulse * size, pulse * size);

    mesh.current.rotation.x += 0.001;
    mesh.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
    </mesh>
  );
};

// Camera Animation
const CameraController = () => {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1;
    camera.position.x = Math.sin(t) * 15;
    camera.position.z = Math.cos(t) * 15;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const Background3D = () => {
  const { mode } = useContext(ThemeContext);

  const primaryColor = mode === "dark" ? "#00f5ff" : "#6200ea";
  const secondaryColor = mode === "dark" ? "#ff4081" : "#00c853";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #050920 0%, #0a1029 100%)"
            : "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <CameraController />

        <Stars
          radius={100}
          depth={50}
          count={mode === "dark" ? 5000 : 1000}
          factor={4}
          saturation={0.5}
          fade
          speed={0.5}
        />

        <FloatingParticles count={300} color={primaryColor} />

        <DataGrid color={primaryColor} />

        <PulsatingSphere
          position={[3, 2, -5]}
          color={primaryColor}
          pulseSpeed={0.8}
          size={0.8}
        />

        <PulsatingSphere
          position={[-4, -3, -2]}
          color={secondaryColor}
          pulseSpeed={1.2}
          size={0.5}
        />

        <PulsatingSphere
          position={[5, -2, 3]}
          color={secondaryColor}
          pulseSpeed={0.9}
          size={0.7}
        />
      </Canvas>
    </div>
  );
};

export default Background3D;