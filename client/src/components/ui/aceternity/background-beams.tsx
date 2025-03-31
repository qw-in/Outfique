"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import { motion, useAnimation } from "framer-motion";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const noise2D = createNoise2D();

  useEffect(() => {
    const animate = async () => {
      const time = Date.now() * 0.001;
      const points = 100;
      const path = Array.from({ length: points }, (_, i) => {
        const x = (i / points) * 100;
        const y = noise2D(x * 0.05 + time, time) * 50 + 50;
        return [x, y];
      });

      await controls.start({
        path,
        transition: { duration: 2, repeat: Infinity, ease: "linear" },
      });
    };

    animate();
  }, [controls, noise2D]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full w-full bg-black [--line-color:theme(colors.slate.900/20)] dark:[--line-color:theme(colors.slate.50/10)]",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        style={{
          maskImage: "radial-gradient(circle at center, black, transparent)",
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent)",
        }}
      >
        <motion.path
          d="M0,0 L100,0"
          stroke="var(--line-color)"
          strokeWidth="0.5"
          fill="none"
          initial={{ path: "M0,0 L100,0" }}
          animate={controls}
        />
      </svg>
    </div>
  );
}; 