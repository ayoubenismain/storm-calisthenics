"use client";

import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function ModelImage() {
  const texture = useLoader(THREE.TextureLoader, '/model.png');
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        {/* Adjusted size to fit the screen nicely */}
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial 
          map={texture} 
          transparent={true} 
          side={THREE.DoubleSide} 
          roughness={0.4}
          metalness={0.8}
          alphaTest={0.05} // Helps cleanly cut out the transparent background
        />
      </mesh>
    </group>
  );
}

export default function ProductViewer() {
  return (
    <div className="w-full h-[60vh] md:h-[85vh] flex items-center justify-center cursor-grab active:cursor-grabbing">
      {/* Adjusted camera to fit the entire product securely in the viewport */}
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#007aff" /> {/* Storm Blue Accent Light */}
        
        <ModelImage />
        
        {/* Soft shadow below the model */}
        <ContactShadows position={[0, -2.5, 0]} opacity={1} scale={10} blur={1} far={4} />

        {/* OrbitControls allows the user to click and drag to rotate */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5} // Restrict vertical rotation so they don't flip it upside down
          minPolarAngle={Math.PI / 3}
        />
        
        <Environment preset="city" /> {/* Adds realistic lighting reflections */}
      </Canvas>
    </div>
  );
}
