import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  type: "circle" | "solar" | "battery" | "leaf" | "wind" | "hydro" | "ev" | "biogas" | "charging-station" | "chip" | "geothermal" | "hydropower-dam";
  rotation: number;
  rotationSpeed: number;
  depth: number;
}

interface EnergySpark {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  life: number;
  maxLife: number;
  intensity: number;
}

interface GeometricShape {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  type: "hexagon" | "triangle" | "square" | "energy-ring" | "circuit-board" | "power-line" | "grid-pattern";
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  // PERF: pre-sorted reference updated at init time, not every frame
  const sortedParticlesRef = useRef<Particle[]>([]);
  const shapesRef = useRef<GeometricShape[]>([]);
  const sparksRef = useRef<EnergySpark[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  const isMobileRef = useRef(
    typeof window !== "undefined"
      ? window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      : false
  );
  const reducedMotionRef = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const isLowEndRef = useRef(
    typeof navigator !== "undefined"
      ? (navigator.hardwareConcurrency ?? 4) <= 2
      : false
  );

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const shapes: GeometricShape[] = [];

    const particleCount = isLowEndRef.current ? 15 : isMobileRef.current ? 28 : 65;
    const weightedTypes: Particle["type"][] = [
      "circle", "circle",
      "solar", "solar", "solar",
      "battery", "battery",
      "leaf", "leaf",
      "wind", "wind", "wind",
      "hydro", "hydro",
      "ev",
      "biogas", "biogas",
      "charging-station",
      "geothermal", "geothermal",
      "hydropower-dam",
      "chip"
    ];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: (Math.random() * 3 + 1.5) * (0.5 + depth * 0.8),
        opacity: (Math.random() * 0.4 + 0.15) * (0.4 + depth * 0.6),
        type: weightedTypes[Math.floor(Math.random() * weightedTypes.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2.5,
        depth,
      });
    }

    // PERF: sort by depth ONCE here at init instead of every animation frame.
    // Depth values don't change at runtime, so the sorted order is stable.
    particles.sort((a, b) => a.depth - b.depth);

    const shapeCount = isLowEndRef.current ? 2 : isMobileRef.current ? 4 : 10;
    const shapeTypes: GeometricShape["type"][] = [
      "hexagon", "triangle", "energy-ring",
      "circuit-board", "power-line", "grid-pattern"
    ];
    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 50 + 25,
        opacity: Math.random() * 0.02 + 0.01,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      });
    }

    particlesRef.current = particles;
    // Keep sortedParticlesRef pointing at the same (already-sorted) array
    sortedParticlesRef.current = particles;
    shapesRef.current = shapes;
    sparksRef.current = [];
  }, []);

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  };

  const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.866, y + size * 0.5);
    ctx.lineTo(x - size * 0.866, y + size * 0.5);
    ctx.closePath();
  };

  const drawEnergyRing = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const startAngle = (rotation * Math.PI / 180) + (i * Math.PI * 2 / 3);
      ctx.beginPath(); ctx.arc(x, y, size * 0.6, startAngle, startAngle + Math.PI / 3); ctx.stroke();
    }
  };

  const drawCircuitBoard = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.beginPath();
    ctx.moveTo(-size / 2, -size / 4); ctx.lineTo(0, -size / 4); ctx.lineTo(0, 0);
    ctx.lineTo(size / 4, 0); ctx.lineTo(size / 4, size / 4); ctx.lineTo(size / 2, size / 4);
    ctx.moveTo(-size / 4, -size / 2); ctx.lineTo(-size / 4, size / 4);
    ctx.moveTo(size / 4, -size / 2); ctx.lineTo(size / 4, -size / 4);
    ctx.stroke();
    const nodeSize = size / 12;
    ctx.beginPath();
    ctx.arc(0, 0, nodeSize, 0, Math.PI * 2);
    ctx.arc(-size / 4, size / 4, nodeSize, 0, Math.PI * 2);
    ctx.arc(size / 4, -size / 4, nodeSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawPowerLine = (ctx: CanvasRenderingContext2D, size: number, rotation: number) => {
    ctx.beginPath();
    ctx.moveTo(0, -size); ctx.lineTo(0, size);
    ctx.moveTo(-size * 0.6, -size * 0.6); ctx.lineTo(size * 0.6, -size * 0.6);
    ctx.moveTo(-size * 0.4, -size * 0.2); ctx.lineTo(size * 0.4, -size * 0.2);
    ctx.moveTo(-size * 0.6, -size * 0.6); ctx.lineTo(0, -size * 0.3); ctx.lineTo(size * 0.6, -size * 0.6);
    ctx.stroke();
    const sag = Math.sin(rotation * 0.05) * size * 0.1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, -size * 0.6);
    ctx.quadraticCurveTo(0, -size * 0.4 + sag, size * 0.8, -size * 0.6);
    ctx.stroke();
  };

  const drawGridPattern = (ctx: CanvasRenderingContext2D, size: number, rotation: number) => {
    const gridSize = size / 3;
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      ctx.beginPath(); ctx.arc(i * gridSize, j * gridSize, size / 15, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath();
    for (let j = -1; j <= 1; j++) { ctx.moveTo(-gridSize, j * gridSize); ctx.lineTo(gridSize, j * gridSize); }
    for (let i = -1; i <= 1; i++) { ctx.moveTo(i * gridSize, -gridSize); ctx.lineTo(i * gridSize, gridSize); }
    ctx.stroke();
    const pulseSize = (size / 10) * (1 + Math.sin(rotation * 0.1) * 0.3);
    ctx.beginPath(); ctx.arc(0, 0, pulseSize, 0, Math.PI * 2); ctx.fill();
  };

  const drawSolarPanel = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.strokeRect(x - size, y - size * 0.7, size * 2, size * 1.4);
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.7); ctx.lineTo(x, y + size * 0.7);
    ctx.moveTo(x - size * 0.5, y - size * 0.7); ctx.lineTo(x - size * 0.5, y + size * 0.7);
    ctx.moveTo(x + size * 0.5, y - size * 0.7); ctx.lineTo(x + size * 0.5, y + size * 0.7);
    ctx.moveTo(x - size, y - size * 0.2); ctx.lineTo(x + size, y - size * 0.2);
    ctx.moveTo(x - size, y + size * 0.2); ctx.lineTo(x + size, y + size * 0.2);
    ctx.stroke();
  };

  const drawWindTurbine = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.beginPath();
    ctx.moveTo(x - size * 0.12, y + size * 1.6); ctx.lineTo(x - size * 0.05, y);
    ctx.lineTo(x + size * 0.05, y); ctx.lineTo(x + size * 0.12, y + size * 1.6);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - size * 0.25, y + size * 1.6); ctx.lineTo(x + size * 0.25, y + size * 1.6); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.08, y - size * 0.1); ctx.lineTo(x + size * 0.22, y - size * 0.1);
    ctx.lineTo(x + size * 0.22, y + size * 0.08); ctx.lineTo(x - size * 0.08, y + size * 0.08);
    ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, size * 0.1, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 3; i++) {
      const bladeAngle = (rotation * Math.PI / 180) + (i * Math.PI * 2 / 3);
      const tipX = x + Math.cos(bladeAngle) * size * 1.4;
      const tipY = y + Math.sin(bladeAngle) * size * 1.4;
      const perpAngle = bladeAngle + Math.PI / 2;
      const baseWidth = size * 0.1; const tipWidth = size * 0.02;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(perpAngle) * baseWidth, y + Math.sin(perpAngle) * baseWidth);
      ctx.lineTo(tipX + Math.cos(perpAngle) * tipWidth, tipY + Math.sin(perpAngle) * tipWidth);
      ctx.lineTo(tipX - Math.cos(perpAngle) * tipWidth, tipY - Math.sin(perpAngle) * tipWidth);
      ctx.lineTo(x - Math.cos(perpAngle) * baseWidth, y - Math.sin(perpAngle) * baseWidth);
      ctx.closePath(); ctx.stroke();
    }
  };

  const drawHydro = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.quadraticCurveTo(x + size * 0.8, y, x, y + size * 0.8);
    ctx.quadraticCurveTo(x - size * 0.8, y, x, y - size);
    ctx.stroke();
    for (let i = 0; i < 2; i++) {
      const yOffset = y - size * 0.3 + i * size * 0.5;
      ctx.beginPath();
      ctx.moveTo(x - size * 0.4, yOffset);
      ctx.quadraticCurveTo(x, yOffset + size * 0.15 * Math.sin(rotation * 0.1), x + size * 0.4, yOffset);
      ctx.stroke();
    }
  };

  const drawEV = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.roundRect(x - size, y - size * 0.3, size * 2, size * 0.8, size * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.2, y - size * 0.3);
    ctx.lineTo(x - size * 0.2, y + size * 0.1);
    ctx.lineTo(x + size * 0.1, y + size * 0.1);
    ctx.lineTo(x - size * 0.1, y + size * 0.5);
    ctx.stroke();
  };

  const drawBiogas = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.beginPath();
    ctx.arc(x, y - size * 0.1, size * 0.8, Math.PI, 0);
    ctx.lineTo(x + size * 0.8, y + size * 0.5); ctx.lineTo(x - size * 0.8, y + size * 0.5);
    ctx.closePath(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.9, y + size * 0.5); ctx.lineTo(x - size * 0.9, y + size * 0.8);
    ctx.lineTo(x + size * 0.9, y + size * 0.8); ctx.lineTo(x + size * 0.9, y + size * 0.5);
    ctx.stroke();
    const flameH = size * 0.25 + Math.sin(rotation * 0.15) * size * 0.08;
    const flameFlicker = Math.sin(rotation * 0.25) * size * 0.04;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.9); ctx.lineTo(x, y - size * 1.2);
    ctx.lineTo(x + size * 0.4, y - size * 1.2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.4, y - size * 1.2);
    ctx.quadraticCurveTo(x + size * 0.4 + flameFlicker, y - size * 1.2 - flameH * 0.6, x + size * 0.4, y - size * 1.2 - flameH);
    ctx.stroke();
  };

  const drawGeothermal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.beginPath();
    ctx.moveTo(x - size * 1.2, y + size * 0.1); ctx.lineTo(x + size * 1.2, y + size * 0.1); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.15, y + size * 0.1); ctx.lineTo(x - size * 0.15, y + size * 1.2);
    ctx.lineTo(x + size * 0.15, y + size * 1.2); ctx.lineTo(x + size * 0.15, y + size * 0.1); ctx.stroke();
    ctx.strokeRect(x - size * 0.5, y - size * 0.5, size * 1.0, size * 0.6);
    ctx.beginPath();
    ctx.moveTo(x - size * 0.6, y - size * 0.5); ctx.lineTo(x, y - size * 0.8); ctx.lineTo(x + size * 0.6, y - size * 0.5); ctx.stroke();
    for (let i = 0; i < 2; i++) {
      const sx = x + (i === 0 ? -size * 0.2 : size * 0.2);
      const steamBase = y - size * 0.8;
      ctx.beginPath();
      for (let j = 0; j <= 8; j++) {
        const py = steamBase - (j / 8) * size * 0.9;
        const px = sx + Math.sin(rotation * 0.1 + j * 0.7 + i * 2) * size * 0.12;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  };

  const drawHydropowerDam = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.beginPath();
    ctx.moveTo(x - size * 0.3, y - size * 0.9); ctx.lineTo(x + size * 0.3, y - size * 0.9);
    ctx.lineTo(x + size * 0.5, y + size * 0.5); ctx.lineTo(x - size * 0.5, y + size * 0.5);
    ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, size * 0.15, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = (rotation * Math.PI / 180) * 2 + (i * Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * size * 0.15, y + Math.sin(a) * size * 0.15); ctx.stroke();
    }
  };

  const drawBattery = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.strokeRect(x - size * 0.6, y - size, size * 1.2, size * 2);
    ctx.fillRect(x - size * 0.2, y - size * 1.2, size * 0.4, size * 0.2);
    ctx.fillRect(x - size * 0.4, y - size * 0.6, size * 0.8, size * 0.4);
  };

  const drawLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.quadraticCurveTo(x + size, y - size * 0.5, x, y + size);
    ctx.quadraticCurveTo(x - size, y - size * 0.5, x, y - size);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - size * 0.8); ctx.lineTo(x, y + size * 0.8); ctx.stroke();
  };

  const drawChargingStation = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.strokeRect(x - size * 0.6, y - size, size * 1.2, size * 1.8);
    ctx.strokeRect(x - size * 0.4, y - size * 0.7, size * 0.8, size * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + size * 0.1, y - size * 0.6); ctx.lineTo(x - size * 0.1, y - size * 0.4);
    ctx.lineTo(x + size * 0.05, y - size * 0.4); ctx.lineTo(x - size * 0.05, y - size * 0.25); ctx.stroke();
  };

  const drawChip = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.strokeRect(x - size * 0.6, y - size * 0.6, size * 1.2, size * 1.2);
    ctx.strokeRect(x - size * 0.3, y - size * 0.3, size * 0.6, size * 0.6);
    for (let i = 0; i < 3; i++) {
      const offset = (i - 1) * size * 0.35;
      ctx.beginPath(); ctx.moveTo(x + offset, y - size * 0.6); ctx.lineTo(x + offset, y - size * 0.9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + offset, y + size * 0.6); ctx.lineTo(x + offset, y + size * 0.9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - size * 0.6, y + offset); ctx.lineTo(x - size * 0.9, y + offset); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + size * 0.6, y + offset); ctx.lineTo(x + size * 0.9, y + offset); ctx.stroke();
    }
  };

  const drawEnergySpark = (
    ctx: CanvasRenderingContext2D,
    fromX: number, fromY: number,
    toX: number, toY: number,
    progress: number, intensity: number
  ) => {
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const dist = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
    const perpX = -(toY - fromY) / dist;
    const perpY = (toX - fromX) / dist;
    const jitter = dist * 0.3 * Math.sin(progress * Math.PI);
    const ctrlX = midX + perpX * jitter;
    const ctrlY = midY + perpY * jitter;
    ctx.save();
    ctx.strokeStyle = `hsla(197, 90%, 75%, ${intensity * 0.9})`;
    ctx.lineWidth = 1.5 * intensity;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, toX, toY);
    ctx.stroke();
    const t = progress;
    const sparkX = (1 - t) * (1 - t) * fromX + 2 * (1 - t) * t * ctrlX + t * t * toX;
    const sparkY = (1 - t) * (1 - t) * fromY + 2 * (1 - t) * t * ctrlY + t * t * toY;
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 2 * intensity, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(45, 100%, 80%, ${intensity})`;
    ctx.fill();
    ctx.restore();
  };

  const animate = useCallback((timestamp: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetInterval = isLowEndRef.current ? 1000 / 30 : 1000 / 60;
    const elapsed = timestamp - lastTimeRef.current;
    if (elapsed < targetInterval) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    lastTimeRef.current = timestamp - (elapsed % targetInterval);

    const width = canvas.width;
    const height = canvas.height;
    frameCountRef.current++;

    ctx.clearRect(0, 0, width, height);

    const useShadow = !isLowEndRef.current;

    shapesRef.current.forEach((shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate((shape.rotation * Math.PI) / 180);
      ctx.strokeStyle = `hsla(197, 68%, 44%, ${shape.opacity})`;
      ctx.fillStyle = `hsla(197, 68%, 44%, ${shape.opacity * 0.5})`;
      ctx.lineWidth = 1;
      if (useShadow) {
        ctx.shadowColor = `hsla(197, 68%, 60%, ${shape.opacity * 0.5})`;
        ctx.shadowBlur = 4;
      }
      switch (shape.type) {
        case "hexagon": drawHexagon(ctx, 0, 0, shape.size); ctx.stroke(); break;
        case "triangle": drawTriangle(ctx, 0, 0, shape.size); ctx.stroke(); break;
        case "energy-ring": drawEnergyRing(ctx, 0, 0, shape.size, shape.rotation); break;
        case "circuit-board": drawCircuitBoard(ctx, shape.size); break;
        case "power-line": drawPowerLine(ctx, shape.size, shape.rotation); break;
        case "grid-pattern": drawGridPattern(ctx, shape.size, shape.rotation); break;
      }
      ctx.restore();
      shape.rotation += shape.rotationSpeed;
    });

    // PERF: use pre-sorted ref — no per-frame sort allocation
    const sortedParticles = sortedParticlesRef.current;

    particlesRef.current.forEach((particle, i) => {
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const depthFactor = 0.3 + particle.depth * 0.7;

      if (distance < 180 && distance > 0) {
        const force = (180 - distance) / 180;
        particle.vx -= (dx / distance) * force * 0.025 * depthFactor;
        particle.vy -= (dy / distance) * force * 0.025 * depthFactor;
      }

      const driftSpeed = 0.004 + particle.depth * 0.006;
      const time = frameCountRef.current * driftSpeed;
      const driftX = Math.sin(time + i * 1.7) * (0.08 + particle.depth * 0.12);
      const driftY = Math.cos(time * 0.7 + i * 2.3) * (0.06 + particle.depth * 0.1);

      particle.x += (particle.vx + driftX) * depthFactor;
      particle.y += (particle.vy + driftY) * depthFactor;
      particle.rotation += particle.rotationSpeed * depthFactor;

      particle.vx *= 0.997;
      particle.vy *= 0.997;
      particle.vx += (Math.random() - 0.5) * 0.06 * depthFactor;
      particle.vy += (Math.random() - 0.5) * 0.06 * depthFactor;

      const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
      if (speed > 1.5) { particle.vx *= 1.5 / speed; particle.vy *= 1.5 / speed; }

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
    });

    sortedParticles.forEach((particle) => {
      ctx.save();
      ctx.strokeStyle = `hsla(197, 68%, 60%, ${particle.opacity})`;
      ctx.fillStyle = `hsla(197, 68%, 50%, ${particle.opacity * 0.3})`;
      ctx.lineWidth = 0.5 + particle.depth * 0.8;
      switch (particle.type) {
        case "solar": drawSolarPanel(ctx, particle.x, particle.y, particle.radius * 2); break;
        case "wind": drawWindTurbine(ctx, particle.x, particle.y, particle.radius * 2.5, particle.rotation); break;
        case "hydro": drawHydro(ctx, particle.x, particle.y, particle.radius * 2, particle.rotation); break;
        case "ev": drawEV(ctx, particle.x, particle.y, particle.radius * 2); break;
        case "biogas": drawBiogas(ctx, particle.x, particle.y, particle.radius * 2, particle.rotation); break;
        case "battery": drawBattery(ctx, particle.x, particle.y, particle.radius * 2); break;
        case "leaf": drawLeaf(ctx, particle.x, particle.y, particle.radius * 2); break;
        case "charging-station": drawChargingStation(ctx, particle.x, particle.y, particle.radius * 2.5); break;
        case "chip": drawChip(ctx, particle.x, particle.y, particle.radius * 2); break;
        case "geothermal": drawGeothermal(ctx, particle.x, particle.y, particle.radius * 2.5, particle.rotation); break;
        case "hydropower-dam": drawHydropowerDam(ctx, particle.x, particle.y, particle.radius * 2.5, particle.rotation); break;
        default:
          ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });

    if (!isLowEndRef.current) {
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((other, j) => {
          const d = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          );
          if (d < 120) {
            const avgDepth = (particle.depth + other.depth) / 2;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(197, 68%, 60%, ${0.15 * (1 - d / 120) * avgDepth})`;
            ctx.lineWidth = 0.3 + avgDepth * 0.4;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            if (frameCountRef.current % 90 === 0 && d < 80 && Math.random() < 0.08 && sparksRef.current.length < 5) {
              sparksRef.current.push({
                fromIndex: i, toIndex: i + 1 + j,
                progress: 0, speed: 0.02 + Math.random() * 0.03,
                life: 0, maxLife: 40 + Math.random() * 30,
                intensity: 0.6 + Math.random() * 0.4,
              });
            }
          }
        });
      });

      sparksRef.current = sparksRef.current.filter((spark) => {
        spark.life++;
        spark.progress += spark.speed;
        if (spark.life > spark.maxLife || spark.progress > 1) return false;
        const from = particlesRef.current[spark.fromIndex];
        const to = particlesRef.current[spark.toIndex];
        if (!from || !to) return false;
        const fadeIn = Math.min(spark.life / 8, 1);
        const fadeOut = Math.max(1 - (spark.life - spark.maxLife + 10) / 10, 0);
        drawEnergySpark(ctx, from.x, from.y, to.x, to.y, spark.progress, spark.intensity * fadeIn * fadeOut);
        return true;
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (reducedMotionRef.current) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      initParticles(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobileRef.current) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    handleResize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, animate]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "transparent" }}
      />
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>
      {/* Pure-CSS floating decorations — replaces Framer Motion to eliminate the
          second animation system running alongside the canvas rAF loop.
          CSS animations run on the compositor thread with zero JS overhead. */}
      <div className="hidden md:block fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-20 right-20 w-24 h-24 border border-primary/15 particle-hex"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        />
        <div
          className="absolute bottom-40 left-20 w-20 h-20 border border-primary/10 particle-tri"
          style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-14 h-14 rounded-full border border-primary/12 particle-circle"
        />
      </div>
    </>
  );
};
