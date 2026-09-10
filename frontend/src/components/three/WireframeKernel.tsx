"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMotion } from "@/components/motion/GsapProvider";

function Network() {
  const group = useRef<THREE.Group>(null);
  const { reducedMotion } = useMotion();

  const { positions, linePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi) * 1.6,
          Math.sin(theta) * Math.sin(phi) * 1.6,
          Math.cos(phi) * 1.6
        )
      );
    }
    const lines: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 1.35) {
          lines.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    return {
      positions: new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])),
      linePositions: new Float32Array(lines),
    };
  }, []);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.12;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    const mx = state.pointer.x * 0.25;
    const my = state.pointer.y * 0.15;
    group.current.rotation.y += mx * 0.02;
    group.current.rotation.x += my * 0.02;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.22} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#34D399" size={0.045} sizeAttenuation />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#10B981" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

export function WireframeKernel() {
  return (
    <>
      <color attach="background" args={["#09090B"]} />
      <ambientLight intensity={0.4} />
      <Network />
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial color="#09090B" />
      </mesh>
    </>
  );
}
