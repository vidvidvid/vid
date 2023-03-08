// @ts-nocheck

import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import type * as three from 'three';
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

const Cube = () => {
  const cube = useRef<three.Mesh>();

  const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.TorusGeometry(1, 0.3, 16, 100),
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.ConeGeometry(0.8, 1.2, 16),
  ];

  const materials = [
    new THREE.MeshStandardMaterial({ color: getRandomColor() }),
    new THREE.MeshBasicMaterial({ color: getRandomColor() }),
    new THREE.MeshStandardMaterial({
      color: getRandomColor(),
      wireframe: true,
    }),
    new THREE.MeshNormalMaterial(),
  ];

  let geometryIndex = 0;
  let materialIndex = 0;

  useFrame(() => {
    geometryIndex = (geometryIndex + 1) % geometries.length;
    materialIndex = (materialIndex + 1) % materials.length;
    cube.current!.geometry = geometries[geometryIndex];
    cube.current!.material = materials[materialIndex];
    cube.current!.rotation.x += 0.01;
    cube.current!.rotation.y += 0.01;
    cube.current!.position.set(...getRandomPosition());
  });

  return <mesh ref={cube} geometry={geometries[0]} material={materials[0]} />;
};

const Scene = () => {
  const cubes = Array.from({ length: NUM_CUBES }, (_, i) => <Cube key={i} />);

  return (
    <>
      {/* <gridHelper /> */}
      {/* <axesHelper /> */}
      <pointLight intensity={1.0} position={[5, 3, 5]} />
      {cubes}
    </>
  );
};

const CrazyComponent: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Canvas
        camera={{
          near: 0.1,
          far: 1000,
          zoom: 0.9,
          position: [0, 2, -15],
          rotation: [THREE.MathUtils.degToRad(230), 40, 90],
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#252934');
        }}
      >
        <Stats />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <mesh>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial color={'#ffffff'} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default CrazyComponent;
