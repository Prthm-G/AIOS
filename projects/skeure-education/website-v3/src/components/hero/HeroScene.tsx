"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* Genuine live-WebGL retro computer, procedurally modelled to match the brand
   poster (navy CRT + cream keyboard + glowing amber screen). Fully offline — no
   external HDRI/model fetch; studio reflections come from inline Lightformers.
   Motion: gentle idle float + pointer parallax + slow auto-rotate. */

const NAVY = "#24304d";
const NAVY_DARK = "#1a2338";
const SCREEN = "#0c1020";
const DECK = "#e7e2d6";
const KEY = "#f3efe6";
const ACCENT = "#ff611a";

function useScreenTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 384;
    const ctx = c.getContext("2d")!;
    // dark screen with a warm amber vignette
    ctx.fillStyle = "#0c1020";
    ctx.fillRect(0, 0, 512, 384);
    const g = ctx.createRadialGradient(256, 150, 40, 256, 200, 340);
    g.addColorStop(0, "rgba(255,150,60,0.35)");
    g.addColorStop(1, "rgba(255,120,40,0.02)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 384);
    // amber terminal text
    ctx.fillStyle = "#ffb066";
    ctx.font = "600 62px 'Fragment Mono', ui-monospace, monospace";
    ctx.fillText("skeure", 40, 150);
    ctx.fillStyle = "#ff8a3d";
    ctx.font = "600 40px 'Fragment Mono', ui-monospace, monospace";
    ctx.fillText("> degree", 42, 220);
    ctx.fillStyle = ACCENT;
    ctx.fillText("> online_", 42, 275);
    // blinking cursor block
    ctx.fillStyle = "#ffc27a";
    ctx.fillRect(238, 246, 20, 30);
    // faint scanlines
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    for (let y = 0; y < 384; y += 4) ctx.fillRect(0, y, 512, 1);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function Keyboard() {
  // 5 rows × 12 keys, one accent key (Enter-ish, row 3 far right).
  const cols = 12;
  const rows = 5;
  const kw = 0.30;
  const gap = 0.075;
  const startX = -((cols - 1) * (kw + gap)) / 2;
  const startZ = -((rows - 1) * (kw + gap)) / 2;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let cIdx = 0; cIdx < cols; cIdx++) {
      const isAccent = r === 2 && cIdx === cols - 1;
      cells.push(
        <RoundedBox
          key={`${r}-${cIdx}`}
          args={[kw, 0.12, kw]}
          radius={0.03}
          smoothness={4}
          position={[startX + cIdx * (kw + gap), 0.07, startZ + r * (kw + gap)]}
        >
          <meshStandardMaterial
            color={isAccent ? ACCENT : KEY}
            roughness={isAccent ? 0.35 : 0.55}
            metalness={0.05}
            emissive={isAccent ? ACCENT : "#000000"}
            emissiveIntensity={isAccent ? 0.55 : 0}
          />
        </RoundedBox>,
      );
    }
  }
  return (
    <group position={[0, -1.15, 1.55]} rotation={[-0.06, 0, 0]}>
      {/* deck */}
      <RoundedBox args={[cols * (kw + gap) + 0.5, 0.22, rows * (kw + gap) + 0.5]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color={DECK} roughness={0.6} metalness={0.04} />
      </RoundedBox>
      {cells}
    </group>
  );
}

function RetroComputer() {
  const screenTex = useScreenTexture();
  return (
    <group>
      {/* monitor body */}
      <RoundedBox args={[4.1, 3.2, 3.1]} radius={0.26} smoothness={5} position={[0, 0.5, 0]}>
        <meshPhysicalMaterial color={NAVY} roughness={0.42} metalness={0.15} clearcoat={0.5} clearcoatRoughness={0.35} />
      </RoundedBox>
      {/* bezel */}
      <RoundedBox args={[3.5, 2.7, 0.2]} radius={0.14} smoothness={5} position={[0, 0.6, 1.5]}>
        <meshStandardMaterial color={NAVY_DARK} roughness={0.5} metalness={0.1} />
      </RoundedBox>
      {/* screen */}
      <mesh position={[0, 0.62, 1.62]}>
        <planeGeometry args={[2.95, 2.2]} />
        <meshStandardMaterial
          map={screenTex}
          emissiveMap={screenTex}
          emissive={"#ffffff"}
          emissiveIntensity={0.9}
          toneMapped={false}
          roughness={0.3}
        />
      </mesh>
      {/* little power LED */}
      <mesh position={[1.5, -0.95, 1.56]}>
        <circleGeometry args={[0.05, 24]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <Keyboard />
    </group>
  );
}

function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    if (reducedMotion) {
      g.rotation.y = -0.5;
      g.rotation.x = 0.05;
      return;
    }
    const t = state.clock.elapsedTime;
    // slow auto-rotate + pointer parallax, eased
    const targetY = -0.5 + state.pointer.x * 0.5 + Math.sin(t * 0.25) * 0.12;
    const targetX = 0.05 - state.pointer.y * 0.25;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
  });
  return (
    <group ref={ref}>
      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={0} floatIntensity={reducedMotion ? 0 : 0.6} floatingRange={[-0.08, 0.08]}>
        <RetroComputer />
      </Float>
    </group>
  );
}

export default function HeroScene({
  reducedMotion = false,
  onReady,
}: {
  reducedMotion?: boolean;
  onReady?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 8.4], fov: 34 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ background: "transparent" }}
      frameloop={reducedMotion ? "demand" : "always"}
      onCreated={() => onReady?.()}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff3e6" />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color="#cbd3f2" />
      <Rig reducedMotion={reducedMotion} />
      <ContactShadows position={[0, -2.35, 0]} opacity={0.35} scale={12} blur={2.6} far={4.5} color="#1a1a1a" />
      {/* offline studio reflections — inline lightformers, no external HDRI */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[3, 4, 4]} scale={[6, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.2} position={[-4, 2, 2]} scale={[4, 6, 1]} color="#ffd3b0" />
        <Lightformer form="rect" intensity={1} position={[0, -3, 3]} scale={[8, 3, 1]} color="#cbd3f2" />
      </Environment>
    </Canvas>
  );
}
