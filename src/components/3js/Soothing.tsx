/* eslint-disable no-param-reassign */

import { Canvas, useFrame } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

THREE.ColorManagement.enabled = false;

const NUM_PARTICLES = 100;

const getRandomColor = () => {
  return `hsl(${Math.random() * 360}, 50%, 50%)`;
};

const getRandomPosition = (): [number, number, number] => {
  return [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
  ];
};

const LightningBolt = ({
  position1,
  position2,
}: {
  position1: THREE.Vector3;
  position2: THREE.Vector3;
}) => {
  const bolt = useRef<THREE.Line>(null);
  const [color, setColor] = useState(getRandomColor());
  const [lengthScale, setLengthScale] = useState(1);

  const createLightningGeometry = () => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const segments = 16;
    const jaggedness = 0.1;

    for (let i = 0; i < segments; i += 1) {
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
    const randomScaleFactor = Math.random() * 1.5;

    bolt.current!.position.copy(startPoint);
    bolt.current!.lookAt(endPoint);
    bolt.current!.scale.set(0.5, scale * lengthScale * randomScaleFactor, 1);
  });

  return (
    // @ts-expect-error R3F line element typing mismatch
    <line ref={bolt}>
      <primitive object={createLightningGeometry()} />
      <lineBasicMaterial attach="material" color={color} linewidth={2} />
    </line>
  );
};

const noise = (x: number, y: number, z: number) => {
  return Math.sin(x * 10 + y * 10 + z * 10);
};

const Particle = ({
  setRef,
  index,
}: {
  setRef: (index: number, ref: THREE.Mesh | null) => void;
  index: number;
}) => {
  const particle = useRef<THREE.Mesh>(null);
  const [particleColor, setParticleColor] = useState(getRandomColor());

  useEffect(() => {
    setRef(index, particle.current);
  }, [setRef, index]);

  useFrame(() => {
    if (!particle.current) return;
    const { position } = particle.current;
    particle.current.position.add(
      new THREE.Vector3(
        noise(position.x, position.y, position.z),
        noise(position.x, position.y + 1, position.z),
        noise(position.x, position.y, position.z + 1)
      )
    );

    if (Math.random() < 0.01) {
      particle.current.position.set(...getRandomPosition());
      setParticleColor(getRandomColor());
    }

    particle.current.rotation.set(
      particle.current.rotation.x + (Math.random() - 0.5) * 0.1,
      particle.current.rotation.y + (Math.random() - 0.5) * 0.1,
      particle.current.rotation.z + (Math.random() - 0.5) * 0.1
    );
  });

  return (
    <mesh ref={particle}>
      <sphereGeometry attach="geometry" args={[Math.random() * 0.5, 32, 32]} />
      <meshStandardMaterial attach="material" color={particleColor} />
    </mesh>
  );
};

const Scene = () => {
  const [_color, setColor] = useState(getRandomColor());
  const particleRefs = useRef<(THREE.Mesh | null)[]>(
    Array(NUM_PARTICLES).fill(null)
  );

  const setRef = (index: number, ref: THREE.Mesh | null) => {
    particleRefs.current[index] = ref;
  };

  useFrame(() => {
    if (Math.random() < 0.01) {
      setColor(getRandomColor());
    }
  });

  const lightningBolts = Array.from({ length: NUM_PARTICLES - 1 }, (_, i) => (
    <LightningBolt
      key={i}
      position1={particleRefs.current[i]?.position || new THREE.Vector3()}
      position2={particleRefs.current[i + 1]?.position || new THREE.Vector3()}
    />
  ));

  const particles = Array.from({ length: NUM_PARTICLES }, (_, i) => (
    <Particle key={i} setRef={setRef} index={i} />
  ));

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
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
