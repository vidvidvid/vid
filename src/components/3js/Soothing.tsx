// @ts-nocheck

import { Canvas, useFrame } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import type * as three from 'three';
import * as THREE from 'three';

const NUM_PARTICLES = 100;

const getRandomColor = () => {
  return `hsl(${Math.random() * 360}, 50%, 50%)`;
};

const getRandomPosition = () => {
  return [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
  ];
};

const LightningBolt = ({ position1, position2 }) => {
  const bolt = useRef<THREE.Line>();
  const [color, setColor] = useState(getRandomColor());
  const [lengthScale, setLengthScale] = useState(1);

  const createLightningGeometry = () => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const segments = 16;
    const jaggedness = 0.1;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const x = t;
      const y = (Math.random() * 2 - 1) * jaggedness;

      vertices.push(x, y, 0);
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    return geometry;
  };

  useEffect(() => {
    const animation = setTimeout(() => {
      setLengthScale(3);
    }, Math.random() * 5000);
    return () => clearTimeout(animation);
  }, []);

  useFrame(() => {
    if (Math.random() < 0.05) {
      setColor(getRandomColor());
    }

    const startPoint = position1.clone();
    const endPoint = position2.clone();
    const scale = endPoint.sub(startPoint).length();
    const randomScaleFactor = Math.random() * 1.5; // Added random scale factor

    bolt.current!.position.copy(startPoint);
    bolt.current!.lookAt(endPoint);
    bolt.current!.scale.set(0.5, scale * lengthScale * randomScaleFactor, 1); // Modify the y-axis scale
  });

  return (
    <line ref={bolt}>
      <primitive object={createLightningGeometry()} />
      <lineBasicMaterial attach="material" color={color} linewidth={2} />
    </line>
  );
};

const Particle = ({ setRef, index }) => {
  const particle = useRef<three.Mesh>();

  useEffect(() => {
    setRef(index, particle.current);
  }, [setRef, index]);

  useFrame(() => {
    particle.current!.position.add(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      )
    );

    if (Math.random() < 0.01) {
      particle.current!.position.set(...getRandomPosition());
    }

    particle.current!.rotation.set(
      particle.current!.rotation.x + (Math.random() - 0.5) * 0.1,
      particle.current!.rotation.y + (Math.random() - 0.5) * 0.1,
      particle.current!.rotation.z + (Math.random() - 0.5) * 0.1
    );
  });

  return <mesh ref={particle} />;
};

const Scene = () => {
  const [color, setColor] = useState(getRandomColor());
  const particleRefs = useRef<(THREE.Mesh | null)[]>(
    Array(NUM_PARTICLES).fill(null)
  );

  const setRef = (index, ref) => {
    particleRefs.current[index] = ref;
  };

  useFrame(() => {
    if (Math.random() < 0.01) {
      setColor(getRandomColor());
    }
  });

  const particles = Array.from({ length: NUM_PARTICLES }, (_, i) => (
    <Particle key={i} color={color} setRef={setRef} index={i} />
  ));

  const lightningBolts = Array.from({ length: NUM_PARTICLES - 1 }, (_, i) => (
    <LightningBolt
      key={i}
      position1={particleRefs.current[i]?.position || new THREE.Vector3()}
      position2={particleRefs.current[i + 1]?.position || new THREE.Vector3()}
    />
  ));

  return (
    <>
      {particles}
      {lightningBolts}
    </>
  );
};

const Soothing: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        zIndex: -1,
      }}
    >
      <Canvas
        camera={{
          near: 0.8,
          far: 1000,
          zoom: 3,
          position: [0, 5, 10],
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('hsl(0, 100%, 3%)');
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Soothing;
