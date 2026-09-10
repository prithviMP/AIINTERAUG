"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { WireframeKernel } from "@/components/three/WireframeKernel";
import { useMotion } from "@/components/motion/GsapProvider";

function StaticFallback() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full opacity-40"
      aria-hidden
    >
      <circle cx="200" cy="150" r="70" fill="none" stroke="#10B981" strokeWidth="0.8" />
      <circle cx="140" cy="110" r="3" fill="#10B981" />
      <circle cx="260" cy="120" r="3" fill="#10B981" />
      <circle cx="180" cy="200" r="3" fill="#34D399" />
      <circle cx="240" cy="190" r="3" fill="#10B981" />
      <path
        d="M140 110 L200 150 L260 120 M180 200 L200 150 L240 190"
        fill="none"
        stroke="#10B981"
        strokeWidth="0.7"
        opacity="0.7"
      />
    </svg>
  );
}

export function HeroCanvas() {
  const { reducedMotion } = useMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (reducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <StaticFallback />
      </div>
    );
  }

  if (!visible) {
    return <div className="pointer-events-none absolute inset-0 -z-10 bg-canvas" />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-canvas/40 to-canvas" />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <WireframeKernel />
        </Suspense>
      </Canvas>
    </div>
  );
}
