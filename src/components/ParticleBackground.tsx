import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

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
  depth: number; // 0-1: 0 = far background, 1 = foreground
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
  const shapesRef = useRef<GeometricShape[]>([]);
  const sparksRef = useRef<EnergySpark[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const shapes: GeometricShape[] = [];

    for (let i = 0; i < 75; i++) {
      const weightedTypes: Particle["type"][] = [
        "circle", "circle",
        "solar", "solar", "solar", "solar",
        "battery", "battery",
        "leaf", "leaf",
        "wind", "wind", "wind", "wind",
        "hydro", "hydro",
        "ev", "ev",
        "biogas", "biogas", "biogas",
        "charging-station", "charging-station",
        "geothermal", "geothermal", "geothermal",
        "hydropower-dam", "hydropower-dam",
        "chip"
      ];
      const depth = Math.random();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: (Math.random() * 3 + 1.5) * (0.5 + depth * 0.8),
        opacity: (Math.random() * 0.4 + 0.15) * (0.4 + depth * 0.6),
        type: weightedTypes[Math.floor(Math.random() * weightedTypes.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2.5,
        depth,
      });
    }

    for (let i = 0; i < 12; i++) {
      const shapeTypes: GeometricShape["type"][] = [
        "hexagon", "triangle", "energy-ring",
        "circuit-board", "power-line", "grid-pattern"
      ];
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
    shapesRef.current = shapes;
    sparksRef.current = [];
  }, []);

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
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
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const startAngle = (rotation * Math.PI / 180) + (i * Math.PI * 2 / 3);
      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, startAngle, startAngle + Math.PI / 3);
      ctx.stroke();
    }
  };

  const drawCircuitBoard = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.beginPath();
    ctx.moveTo(-size / 2, -size / 4);
    ctx.lineTo(0, -size / 4);
    ctx.lineTo(0, 0);
    ctx.lineTo(size / 4, 0);
    ctx.lineTo(size / 4, size / 4);
    ctx.lineTo(size / 2, size / 4);
    ctx.moveTo(-size / 4, -size / 2);
    ctx.lineTo(-size / 4, size / 4);
    ctx.moveTo(size / 4, -size / 2);
    ctx.lineTo(size / 4, -size / 4);
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
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.moveTo(-size * 0.6, -size * 0.6);
    ctx.lineTo(size * 0.6, -size * 0.6);
    ctx.moveTo(-size * 0.4, -size * 0.2);
    ctx.lineTo(size * 0.4, -size * 0.2);
    ctx.moveTo(-size * 0.6, -size * 0.6);
    ctx.lineTo(0, -size * 0.3);
    ctx.lineTo(size * 0.6, -size * 0.6);
    ctx.stroke();
    const sag = Math.sin(rotation * 0.05) * size * 0.1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, -size * 0.6);
    ctx.quadraticCurveTo(0, -size * 0.4 + sag, size * 0.8, -size * 0.6);
    ctx.stroke();
  };

  const drawGridPattern = (ctx: CanvasRenderingContext2D, size: number, rotation: number) => {
    const gridSize = size / 3;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        ctx.beginPath();
        ctx.arc(i * gridSize, j * gridSize, size / 15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.beginPath();
    for (let j = -1; j <= 1; j++) {
      ctx.moveTo(-gridSize, j * gridSize);
      ctx.lineTo(gridSize, j * gridSize);
    }
    for (let i = -1; i <= 1; i++) {
      ctx.moveTo(i * gridSize, -gridSize);
      ctx.lineTo(i * gridSize, gridSize);
    }
    ctx.stroke();
    const pulseSize = (size / 10) * (1 + Math.sin(rotation * 0.1) * 0.3);
    ctx.beginPath();
    ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSolarPanel = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.strokeRect(x - size, y - size * 0.7, size * 2, size * 1.4);
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.7);
    ctx.lineTo(x, y + size * 0.7);
    ctx.moveTo(x - size * 0.5, y - size * 0.7);
    ctx.lineTo(x - size * 0.5, y + size * 0.7);
    ctx.moveTo(x + size * 0.5, y - size * 0.7);
    ctx.lineTo(x + size * 0.5, y + size * 0.7);
    ctx.moveTo(x - size, y - size * 0.2);
    ctx.lineTo(x + size, y - size * 0.2);
    ctx.moveTo(x - size, y + size * 0.2);
    ctx.lineTo(x + size, y + size * 0.2);
    ctx.stroke();
  };

  const drawWindTurbine = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.beginPath();
    ctx.moveTo(x - size * 0.12, y + size * 1.6);
    ctx.lineTo(x - size * 0.05, y);
    ctx.lineTo(x + size * 0.05, y);
    ctx.lineTo(x + size * 0.12, y + size * 1.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.25, y + size * 1.6);
    ctx.lineTo(x + size * 0.25, y + size * 1.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.08, y - size * 0.1);
    ctx.lineTo(x + size * 0.22, y - size * 0.1);
    ctx.lineTo(x + size * 0.22, y + size * 0.08);
    ctx.lineTo(x - size * 0.08, y + size * 0.08);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      const bladeAngle = (rotation * Math.PI / 180) + (i * Math.PI * 2 / 3);
      const tipX = x + Math.cos(bladeAngle) * size * 1.4;
      const tipY = y + Math.sin(bladeAngle) * size * 1.4;
      const perpAngle = bladeAngle + Math.PI / 2;
      const baseWidth = size * 0.1;
      const tipWidth = size * 0.02;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(perpAngle) * baseWidth, y + Math.sin(perpAngle) * baseWidth);
      ctx.lineTo(tipX + Math.cos(perpAngle) * tipWidth, tipY + Math.sin(perpAngle) * tipWidth);
      ctx.lineTo(tipX - Math.cos(perpAngle) * tipWidth, tipY - Math.sin(perpAngle) * tipWidth);
      ctx.lineTo(x - Math.cos(perpAngle) * baseWidth, y - Math.sin(perpAngle) * baseWidth);
      ctx.closePath();
      ctx.stroke();
    }
  };

  const drawHydro = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.quadraticCurveTo(x + size * 0.8, y, x, y + size * 0.8);
    ctx.quadraticCurveTo(x - size * 0.8, y, x, y - size);
    ctx.stroke();
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      const yOffset = y - size * 0.3 + i * size * 0.5;
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
    ctx.lineTo(x + size * 0.8, y + size * 0.5);
    ctx.lineTo(x - size * 0.8, y + size * 0.5);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.9, y + size * 0.5);
    ctx.lineTo(x - size * 0.9, y + size * 0.8);
    ctx.lineTo(x + size * 0.9, y + size * 0.8);
    ctx.lineTo(x + size * 0.9, y + size * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.9, y + size * 0.2);
    ctx.lineTo(x - size * 1.3, y - size * 0.1);
    ctx.lineTo(x - size * 1.3, y - size * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 1.45, y - size * 0.3);
    ctx.lineTo(x - size * 1.15, y - size * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.9);
    ctx.lineTo(x, y - size * 1.2);
    ctx.lineTo(x + size * 0.4, y - size * 1.2);
    ctx.stroke();
    const flameH = size * 0.25 + Math.sin(rotation * 0.15) * size * 0.08;
    const flameFlicker = Math.sin(rotation * 0.25) * size * 0.04;
    ctx.beginPath();
    ctx.moveTo(x + size * 0.4, y - size * 1.2);
    ctx.quadraticCurveTo(x + size * 0.4 + flameFlicker, y - size * 1.2 - flameH * 0.6, x + size * 0.4, y - size * 1.2 - flameH);
    ctx.stroke();
    const bubble1Y = y + size * 0.15 + Math.sin(rotation * 0.08) * size * 0.2;
    const bubble2Y = y - size * 0.15 + Math.sin(rotation * 0.12 + 1.5) * size * 0.15;
    const bubble3Y = y + size * 0.05 + Math.sin(rotation * 0.1 + 3) * size * 0.18;
    ctx.beginPath(); ctx.arc(x - size * 0.25, bubble1Y, size * 0.07, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + size * 0.2, bubble2Y, size * 0.05, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + size * 0.05, bubble3Y, size * 0.04, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.9, y + size * 0.3);
    ctx.lineTo(x + size * 1.2, y + size * 0.3);
    ctx.lineTo(x + size * 1.2, y + size * 0.6);
    ctx.stroke();
  };

  // Geothermal: underground well with steam vents and heat waves
  const drawGeothermal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    // Ground surface line
    ctx.beginPath();
    ctx.moveTo(x - size * 1.2, y + size * 0.1);
    ctx.lineTo(x + size * 1.2, y + size * 0.1);
    ctx.stroke();

    // Underground well shaft
    ctx.beginPath();
    ctx.moveTo(x - size * 0.15, y + size * 0.1);
    ctx.lineTo(x - size * 0.15, y + size * 1.2);
    ctx.lineTo(x + size * 0.15, y + size * 1.2);
    ctx.lineTo(x + size * 0.15, y + size * 0.1);
    ctx.stroke();

    // Underground heat reservoir (wavy)
    ctx.beginPath();
    ctx.moveTo(x - size * 0.8, y + size * 1.2);
    for (let i = 0; i <= 8; i++) {
      const wx = x - size * 0.8 + (i / 8) * size * 1.6;
      const wy = y + size * 1.2 + Math.sin(rotation * 0.08 + i * 0.8) * size * 0.15;
      ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    // Heat waves underground (rising squiggles)
    for (let i = 0; i < 3; i++) {
      const hx = x + (i - 1) * size * 0.3;
      const baseY = y + size * 0.8;
      ctx.beginPath();
      for (let j = 0; j <= 6; j++) {
        const py = baseY + (j / 6) * size * 0.35;
        const px = hx + Math.sin(rotation * 0.12 + j * 1.2 + i) * size * 0.08;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Power plant building on surface
    ctx.strokeRect(x - size * 0.5, y - size * 0.5, size * 1.0, size * 0.6);
    // Roof
    ctx.beginPath();
    ctx.moveTo(x - size * 0.6, y - size * 0.5);
    ctx.lineTo(x, y - size * 0.8);
    ctx.lineTo(x + size * 0.6, y - size * 0.5);
    ctx.stroke();

    // Rising steam columns (animated)
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

    // Small steam puffs at top
    const puffY = y - size * 1.5 + Math.sin(rotation * 0.06) * size * 0.1;
    ctx.beginPath();
    ctx.arc(x - size * 0.15, puffY, size * 0.08, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + size * 0.25, puffY - size * 0.1, size * 0.06, 0, Math.PI * 2);
    ctx.stroke();
  };

  // Hydropower dam with water flow, turbine, and mist
  const drawHydropowerDam = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    // Dam wall (trapezoidal)
    ctx.beginPath();
    ctx.moveTo(x - size * 0.3, y - size * 0.9);
    ctx.lineTo(x + size * 0.3, y - size * 0.9);
    ctx.lineTo(x + size * 0.5, y + size * 0.5);
    ctx.lineTo(x - size * 0.5, y + size * 0.5);
    ctx.closePath();
    ctx.stroke();

    // Water level behind dam (upstream)
    ctx.beginPath();
    const waveOffset = Math.sin(rotation * 0.06) * size * 0.05;
    ctx.moveTo(x - size * 1.5, y - size * 0.7 + waveOffset);
    for (let i = 0; i <= 6; i++) {
      const wx = x - size * 1.5 + (i / 6) * size * 1.2;
      const wy = y - size * 0.7 + Math.sin(rotation * 0.08 + i * 1.0) * size * 0.06;
      ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    // Water spillway (falling water)
    for (let i = 0; i < 3; i++) {
      const fx = x + size * 0.35 + i * size * 0.1;
      ctx.beginPath();
      ctx.moveTo(fx, y - size * 0.3);
      ctx.quadraticCurveTo(
        fx + Math.sin(rotation * 0.15 + i) * size * 0.05,
        y + size * 0.1,
        fx + size * 0.15,
        y + size * 0.5
      );
      ctx.stroke();
    }

    // Downstream river
    ctx.beginPath();
    ctx.moveTo(x + size * 0.5, y + size * 0.5);
    for (let i = 0; i <= 6; i++) {
      const wx = x + size * 0.5 + (i / 6) * size * 1.2;
      const wy = y + size * 0.5 + Math.sin(rotation * 0.1 + i * 0.8) * size * 0.05;
      ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    // Turbine symbol inside dam
    ctx.beginPath();
    ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = (rotation * Math.PI / 180) * 2 + (i * Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * size * 0.15, y + Math.sin(a) * size * 0.15);
      ctx.stroke();
    }

    // Power lines going from dam
    ctx.beginPath();
    ctx.moveTo(x - size * 0.3, y - size * 0.9);
    ctx.lineTo(x - size * 0.8, y - size * 1.2);
    ctx.moveTo(x - size * 0.8, y - size * 1.3);
    ctx.lineTo(x - size * 0.8, y - size * 1.1);
    ctx.stroke();

    // Mist/spray at base
    for (let i = 0; i < 3; i++) {
      const mx = x + size * 0.55 + i * size * 0.12;
      const my = y + size * 0.45 - Math.abs(Math.sin(rotation * 0.1 + i * 1.5)) * size * 0.15;
      ctx.beginPath();
      ctx.arc(mx, my, size * 0.04 + Math.sin(rotation * 0.08 + i) * size * 0.02, 0, Math.PI * 2);
      ctx.stroke();
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
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.8);
    ctx.lineTo(x, y + size * 0.8);
    ctx.stroke();
  };

  const drawChargingStation = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.strokeRect(x - size * 0.6, y - size, size * 1.2, size * 1.8);
    ctx.strokeRect(x - size * 0.4, y - size * 0.7, size * 0.8, size * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + size * 0.6, y + size * 0.2);
    ctx.quadraticCurveTo(x + size * 1.2, y + size * 0.4, x + size, y + size * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + size, y + size * 0.8, size * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.1, y - size * 0.6);
    ctx.lineTo(x - size * 0.1, y - size * 0.4);
    ctx.lineTo(x + size * 0.05, y - size * 0.4);
    ctx.lineTo(x - size * 0.05, y - size * 0.25);
    ctx.stroke();
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
    ctx.shadowColor = `hsla(197, 90%, 70%, ${intensity * 0.8})`;
    ctx.shadowBlur = 8 * intensity;
    ctx.strokeStyle = `hsla(197, 90%, 75%, ${intensity * 0.9})`;
    ctx.lineWidth = 1.5 * intensity;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, toX, toY);
    ctx.stroke();
    ctx.strokeStyle = `hsla(197, 100%, 90%, ${intensity * 0.6})`;
    ctx.lineWidth = 0.5 * intensity;
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

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    frameCountRef.current++;

    ctx.clearRect(0, 0, width, height);

    // Draw geometric shapes with glow
    shapesRef.current.forEach((shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate((shape.rotation * Math.PI) / 180);
      ctx.strokeStyle = `hsla(197, 68%, 44%, ${shape.opacity})`;
      ctx.fillStyle = `hsla(197, 68%, 44%, ${shape.opacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.shadowColor = `hsla(197, 68%, 60%, ${shape.opacity * 0.5})`;
      ctx.shadowBlur = 4;

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

    // Sort particles by depth for proper layering (far first)
    const sortedParticles = [...particlesRef.current].sort((a, b) => a.depth - b.depth);

    // Draw and update particles with parallax
    particlesRef.current.forEach((particle, i) => {
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Parallax: deeper particles react less to mouse
      const depthFactor = 0.3 + particle.depth * 0.7;

      if (distance < 180) {
        const force = (180 - distance) / 180;
        particle.vx -= (dx / distance) * force * 0.025 * depthFactor;
        particle.vy -= (dy / distance) * force * 0.025 * depthFactor;
      }

      // Parallax drift speed: deeper = slower
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
      if (speed > 1.5) {
        particle.vx *= 1.5 / speed;
        particle.vy *= 1.5 / speed;
      }

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
    });

    // Draw sorted by depth (background first)
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
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
      ctx.restore();
    });

    // Draw connections with energy flow effect
    particlesRef.current.forEach((particle, i) => {
      particlesRef.current.slice(i + 1).forEach((other, j) => {
        const d = Math.sqrt(
          Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
        );
        if (d < 120) {
          const avgDepth = (particle.depth + other.depth) / 2;
          const gradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y);
          gradient.addColorStop(0, `hsla(197, 68%, 50%, ${0.15 * (1 - d / 120) * avgDepth})`);
          gradient.addColorStop(0.5, `hsla(197, 68%, 70%, ${0.2 * (1 - d / 120) * avgDepth})`);
          gradient.addColorStop(1, `hsla(197, 68%, 50%, ${0.15 * (1 - d / 120) * avgDepth})`);

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.3 + avgDepth * 0.4;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();

          if (frameCountRef.current % 90 === 0 && d < 80 && Math.random() < 0.08 && sparksRef.current.length < 5) {
            sparksRef.current.push({
              fromIndex: i,
              toIndex: i + 1 + j,
              progress: 0,
              speed: 0.02 + Math.random() * 0.03,
              life: 0,
              maxLife: 40 + Math.random() * 30,
              intensity: 0.6 + Math.random() * 0.4,
            });
          }
        }
      });
    });

    // Draw and update energy sparks
    sparksRef.current = sparksRef.current.filter((spark) => {
      spark.life++;
      spark.progress += spark.speed;
      if (spark.life > spark.maxLife || spark.progress > 1) return false;
      const from = particlesRef.current[spark.fromIndex];
      const to = particlesRef.current[spark.toIndex];
      if (!from || !to) return false;
      const fadeIn = Math.min(spark.life / 8, 1);
      const fadeOut = Math.max(1 - (spark.life - spark.maxLife + 10) / 10, 0);
      const alpha = spark.intensity * fadeIn * fadeOut;
      drawEnergySpark(ctx, from.x, from.y, to.x, to.y, spark.progress, alpha);
      return true;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, animate]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "transparent" }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-24 h-24 border border-primary/15"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          animate={{ rotate: 360, x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
          transition={{ rotate: { duration: 35, repeat: Infinity, ease: "linear" }, x: { duration: 18, repeat: Infinity, ease: "easeInOut" }, y: { duration: 14, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-20 h-20 border border-primary/10"
          style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
          animate={{ rotate: -360, x: [0, -50, 40, 0], y: [0, 45, -20, 0] }}
          transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, x: { duration: 22, repeat: Infinity, ease: "easeInOut" }, y: { duration: 16, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-14 h-14 rounded-full border border-primary/12"
          animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.25, 0.12], x: [0, 70, -40, 0], y: [0, -50, 30, 0] }}
          transition={{ scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }, x: { duration: 20, repeat: Infinity, ease: "easeInOut" }, y: { duration: 15, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.div
          className="absolute top-1/4 left-10 w-px bg-gradient-to-b from-primary/30 via-primary/15 to-transparent"
          style={{ height: "100px" }}
          animate={{ opacity: [0.15, 0.4, 0.15], x: [0, 30, -20, 0], y: [0, 35, -10, 0] }}
          transition={{ opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }, x: { duration: 16, repeat: Infinity, ease: "easeInOut" }, y: { duration: 12, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.div
          className="absolute top-20 left-1/3 w-2 h-2 rounded-full bg-primary/40 blur-sm"
          animate={{ x: [0, 120, -60, 80, 0], y: [0, 60, 120, -30, 0], opacity: [0.3, 0.6, 0.4, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-primary/50"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4], x: [0, -40, 30, 0], y: [0, 25, -35, 0] }}
          transition={{ scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }, x: { duration: 14, repeat: Infinity, ease: "easeInOut" }, y: { duration: 11, repeat: Infinity, ease: "easeInOut" } }}
        />
      </div>
    </>
  );
};
