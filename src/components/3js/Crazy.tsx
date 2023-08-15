/* eslint-disable no-multi-assign */
// @ts-nocheck

import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

const NUM_CUBES = 200;

const getRandomColor = () => {
  return `hsl(${Math.random() * 360}, 50%, 50%)`;
};

const getRandomPosition = () => {
  return [
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
  ];
};

const getRandomScale = () => {
  return Math.random() * 0.5 + 0.5; // returns value between 0.5 to 1
};

const Cube = () => {
  const cube = useRef<three.Mesh>();
  const scale = getRandomScale();

  useFrame(() => {
    cube.current!.rotation.x += 0.01 * scale;
    cube.current!.rotation.y += 0.01 * scale;
    cube.current!.position.y += Math.sin(Date.now() / 2000) * 0.01 * scale;
  });

  return (
    <mesh
      ref={cube}
      scale={[scale, scale, scale]}
      position={getRandomPosition()}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getRandomColor()} />
    </mesh>
  );
};

const Ground = () => {
  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load('/assets/music/real.PNG');
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(50, 50);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeBufferGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={groundTexture} />
    </mesh>
  );
};

const MovingLight = () => {
  const light = useRef<three.PointLight>();
  useFrame(() => {
    light.current!.position.x = 10 * Math.sin(Date.now() / 2000);
    light.current!.position.z = 10 * Math.cos(Date.now() / 2000);
  });
  return (
    <pointLight ref={light} intensity={1.2} position={[5, 5, 5]} castShadow />
  );
};

const Scene = () => {
  const cubes = Array.from({ length: NUM_CUBES }, (_, i) => <Cube key={i} />);
  return (
    <>
      <Stars />
      <ambientLight intensity={0.3} />
      <MovingLight />
      <Ground />
      {cubes}
    </>
  );
};

const Evolved: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'absolute',
      }}
    >
      <Canvas shadows camera={{ position: [0, 2, -15] }}>
        <OrbitControls />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Evolved;
