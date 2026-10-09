"use client";

/** Shared glowing material for the code glyphs. */
function GlyphMaterial({ color }: { color: string }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.45}
      roughness={0.28}
      emissive={color}
      emissiveIntensity={0.4}
    />
  );
}

const ACCENT = "#2dd4bf";
const CYAN = "#38bdf8";
const PINK = "#fb923c";

/** `</>` — code brackets. */
export function Brackets({ color = ACCENT }: { color?: string }) {
  const t = 0.1;
  const l = 0.5;
  const y = 0.15;
  return (
    <group>
      <mesh position={[-1.0, y, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[l, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[-1.0, -y, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[l, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.8, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[1.0, y, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[l, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[1.0, -y, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[l, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
    </group>
  );
}

/** `( )` — parentheses. */
export function Parens({ color = CYAN }: { color?: string }) {
  const arc = Math.PI * 1.34;
  return (
    <group>
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[0.45, 0.055, 16, 40, arc]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 3 + Math.PI]}>
        <torusGeometry args={[0.45, 0.055, 16, 40, arc]} />
        <GlyphMaterial color={color} />
      </mesh>
    </group>
  );
}

/** `#` — hash / comment. */
export function Hash({ color = PINK }: { color?: string }) {
  const t = 0.1;
  return (
    <group>
      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[0.64, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.19, 0]}>
        <boxGeometry args={[0.64, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[-0.19, 0, 0]}>
        <boxGeometry args={[t, 0.7, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[0.19, 0, 0]}>
        <boxGeometry args={[t, 0.7, t]} />
        <GlyphMaterial color={color} />
      </mesh>
    </group>
  );
}

/** `>_` — terminal prompt. */
export function Prompt({ color = CYAN }: { color?: string }) {
  const t = 0.1;
  return (
    <group>
      <mesh position={[0.28, 0.13, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.46, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[0.28, -0.13, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.46, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[0.95, -0.3, 0]}>
        <boxGeometry args={[0.55, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
    </group>
  );
}

/** `=>` — arrow function / fat arrow. */
export function Arrow({ color = ACCENT }: { color?: string }) {
  const t = 0.1;
  return (
    <group>
      <mesh position={[-0.35, 0.11, 0]}>
        <boxGeometry args={[0.5, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[-0.35, -0.11, 0]}>
        <boxGeometry args={[0.5, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[0.42, 0.15, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.5, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
      <mesh position={[0.42, -0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.5, t, t]} />
        <GlyphMaterial color={color} />
      </mesh>
    </group>
  );
}