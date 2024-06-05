/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
// @ts-nocheck

import type { InstancedMesh } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const NUM_OBJECTS = 200;

const getRandomColor = () => {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
};

const getRandomPosition = () => {
  return [
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
  ];
};

const getRandomScale = () => {
  return Math.random() * 1.5 + 0.5;
};

const getRandomSpeed = () => {
  return Math.random() * 0.2 + 0.05;
};

const getRandomGeometry = () => {
  const geometries = [
    // new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.75, 32, 32),
    // new THREE.ConeGeometry(0.5, 1, 32),
    // new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    // new THREE.TorusGeometry(0.5, 0.2, 16, 100),
  ];
  return geometries[Math.floor(Math.random() * geometries.length)];
};

const Objects = () => {
  const ref = useRef<InstancedMesh>();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const objectData = useMemo(
    () =>
      Array.from({ length: NUM_OBJECTS }, () => ({
        position: getRandomPosition(),
        scale: getRandomScale(),
        color: getRandomColor(),
        speed: getRandomSpeed(),
        geometry: getRandomGeometry(),
        crazy: false,
      })),
    []
  );

  useFrame(() => {
    objectData.forEach((obj, i) => {
      const { scale, crazy, speed } = obj;

      if (!crazy && Math.random() < 0.005) {
        obj.crazy = true;
        obj.crazyStart = Date.now();
      }

      if (obj.crazy) {
        const elapsed = (Date.now() - obj.crazyStart) / 1000;
        if (elapsed < 2) {
          dummy.scale.setScalar(2 * Math.sin(elapsed * Math.PI));
          dummy.position.x += Math.sin(Date.now() / 200 + i) * 2;
          dummy.position.y += Math.cos(Date.now() / 200 + i) * 2;
        } else {
          obj.crazy = false;
        }
      } else {
        dummy.position.set(...obj.position);
        dummy.rotation.x += speed * scale;
        dummy.rotation.y += speed * scale;
        dummy.position.y += Math.sin(Date.now() / 100 + i) * 0.5 * scale;
        dummy.position.x += Math.cos(Date.now() / 100 + i) * 0.5 * scale;
        dummy.scale.setScalar(Math.sin(Date.now() / 500 + i) * 0.5 + 1);
      }

      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      ref.current!.setColorAt(i, new THREE.Color(getRandomColor()));
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, NUM_OBJECTS]}
      castShadow
    >
      {objectData.map((obj, i) => (
        <primitive key={i} attach="geometry" object={obj.geometry} />
      ))}
      <meshStandardMaterial />
    </instancedMesh>
  );
};

const MovingLight = () => {
  const light = useRef<THREE.PointLight>();
  useFrame(() => {
    light.current!.position.x = 20 * Math.sin(Date.now() / 500);
    light.current!.position.z = 20 * Math.cos(Date.now() / 500);
    light.current!.color.setHSL(Math.sin(Date.now() / 1000), 1, 0.5);
  });
  return (
    <pointLight
      ref={light}
      intensity={1.5}
      position={[10, 10, 10]}
      castShadow
    />
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <MovingLight />
      <Objects />
    </>
  );
};

const Evolved: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        position: 'absolute',
      }}
    >
      <Canvas shadows camera={{ position: [0, 2, -25] }}>
        <OrbitControls />
        <Scene />
      </Canvas>
    </div>
  );
};

export default Evolved;
