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
  const bolt = useRef<THREE.Mesh>();
  const [offset] = useState(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    )
  );
  const [rotationOffset] = useState(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    )
  );

  useFrame(() => {
    bolt.current!.position.copy(position1).add(offset);
    bolt.current!.rotation.setFromVector3(rotationOffset);
    bolt.current!.scale.set(0, 30, position2.distanceTo(position1));
  });

  return (
    <mesh ref={bolt}>
      <cylinderGeometry args={[0.01, 0.01, 1, 16]} />
      <meshBasicMaterial attach="material" color="#ffffff" />
    </mesh>
  );
};

const Particle = ({ color }) => {
  const particle = useRef<three.Mesh>();
  const material = useRef<THREE.MeshStandardMaterial>(
    new THREE.MeshStandardMaterial({
      color,
      wireframe: true,
    })
  );
  const [showLightning, setShowLightning] = useState(false);
  const [particlePosition, setParticlePosition] = useState([0, 0, 0]);
  const [otherParticlePosition, setOtherParticlePosition] = useState([0, 0, 0]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLightning(Math.random() < 0.2);
    }, Math.random() * 2000);
    return () => clearTimeout(timeoutId);
  }, [showLightning]);

  useFrame(() => {
    particle.current!.position.add(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      )
    );

    if (Math.random() < 0.01) {
      particle.current!.position.set(...getRandomPosition());
    }
    setParticlePosition(particle.current!.position);
  });

  const otherParticle = useRef<three.Mesh>();
  useFrame(() => {
    otherParticle.current!.position.add(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      )
    );

    if (Math.random() < 0.01) {
      otherParticle.current!.position.set(...getRandomPosition());
    }
    setOtherParticlePosition(otherParticle.current!.position);
  });

  useEffect(() => {}, [particlePosition, otherParticlePosition]);
  //

  return (
    <>
      <mesh
        ref={particle}
        position={particlePosition}
        material={material.current}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial attach="material" color={color} />
      </mesh>
      <mesh ref={otherParticle} position={otherParticlePosition}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial attach="material" color={color} />
      </mesh>
      {showLightning && (
        <LightningBolt
          position1={particlePosition}
          position2={otherParticlePosition}
        />
      )}
    </>
  );
};

const Scene = () => {
  const [color, setColor] = useState(getRandomColor());

  useFrame(() => {
    if (Math.random() < 0.01) {
      setColor(getRandomColor());
    }
  });

  const particles = Array.from({ length: NUM_PARTICLES }, (_, i) => (
    <Particle key={i} color={color} />
  ));

  return <>{particles}</>;
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
          gl.setClearColor(getRandomColor());
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
