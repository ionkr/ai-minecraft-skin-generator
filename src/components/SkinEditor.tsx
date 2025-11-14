import { useEffect, useRef, useState, useCallback } from 'react';
import type { EditorTool } from '../types/skin';

interface SkinEditorProps {
  skinData: string;
  onSkinChange: (newSkinData: string) => void;
  scale?: number;
}

export function SkinEditor({ skinData, onSkinChange, scale = 8 }: SkinEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<EditorTool['type']>('pencil');
  const [currentColor, setCurrentColor] = useState('#3498db');
  const [brushSize, setBrushSize] = useState(1);

  const SKIN_SIZE = 64;
  const CANVAS_SIZE = SKIN_SIZE * scale;

  // Load skin data onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    };
    img.src = skinData;
  }, [skinData, CANVAS_SIZE]);

  // Get pixel coordinates from mouse event
  const getPixelCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / scale);
      const y = Math.floor((e.clientY - rect.top) / scale);

      if (x >= 0 && x < SKIN_SIZE && y >= 0 && y < SKIN_SIZE) {
        return { x, y };
      }
      return null;
    },
    [scale, SKIN_SIZE]
  );

  // Draw pixel
  const drawPixel = useCallback(
    (x: number, y: number, color: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = color;

      // Apply brush size
      for (let dx = 0; dx < brushSize; dx++) {
        for (let dy = 0; dy < brushSize; dy++) {
          const px = x + dx;
          const py = y + dy;
          if (px < SKIN_SIZE && py < SKIN_SIZE) {
            ctx.fillRect(px * scale, py * scale, scale, scale);
          }
        }
      }

      // Update skin data
      updateSkinData();
    },
    [brushSize, scale, SKIN_SIZE]
  );

  // Erase pixel
  const erasePixel = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      for (let dx = 0; dx < brushSize; dx++) {
        for (let dy = 0; dy < brushSize; dy++) {
          const px = x + dx;
          const py = y + dy;
          if (px < SKIN_SIZE && py < SKIN_SIZE) {
            ctx.clearRect(px * scale, py * scale, scale, scale);
          }
        }
      }

      updateSkinData();
    },
    [brushSize, scale, SKIN_SIZE]
  );

  // Fill area with color (flood fill algorithm)
  const fillArea = useCallback(
    (startX: number, startY: number, fillColor: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      const data = imageData.data;

      // Get target color at start position
      const startPos = (startY * scale * CANVAS_SIZE + startX * scale) * 4;
      const targetR = data[startPos];
      const targetG = data[startPos + 1];
      const targetB = data[startPos + 2];
      const targetA = data[startPos + 3];

      // Parse fill color
      const fillRgb = hexToRgb(fillColor);
      if (!fillRgb) return;

      // Don't fill if target color is the same as fill color
      if (
        targetR === fillRgb.r &&
        targetG === fillRgb.g &&
        targetB === fillRgb.b &&
        targetA === 255
      ) {
        return;
      }

      const stack: Array<[number, number]> = [[startX, startY]];
      const visited = new Set<string>();

      while (stack.length > 0) {
        const [x, y] = stack.pop()!;
        const key = `${x},${y}`;

        if (visited.has(key)) continue;
        if (x < 0 || x >= SKIN_SIZE || y < 0 || y >= SKIN_SIZE) continue;

        visited.add(key);

        // Check if this pixel matches target color
        const pos = (y * scale * CANVAS_SIZE + x * scale) * 4;
        if (
          data[pos] !== targetR ||
          data[pos + 1] !== targetG ||
          data[pos + 2] !== targetB ||
          data[pos + 3] !== targetA
        ) {
          continue;
        }

        // Fill this pixel
        ctx.fillStyle = fillColor;
        ctx.fillRect(x * scale, y * scale, scale, scale);

        // Add neighbors
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }

      updateSkinData();
    },
    [scale, CANVAS_SIZE, SKIN_SIZE]
  );

  // Pick color from pixel (eyedropper)
  const pickColor = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const imageData = ctx.getImageData(x * scale, y * scale, 1, 1);
      const [r, g, b, a] = imageData.data;

      if (a > 0) {
        const hex = rgbToHex(r, g, b);
        setCurrentColor(hex);
      }
    },
    [scale]
  );

  // Update skin data
  const updateSkinData = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary 64x64 canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = SKIN_SIZE;
    tempCanvas.height = SKIN_SIZE;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(canvas, 0, 0, SKIN_SIZE, SKIN_SIZE);

    const dataUrl = tempCanvas.toDataURL('image/png');
    onSkinChange(dataUrl);
  }, [SKIN_SIZE, onSkinChange]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoords(e);
    if (!coords) return;

    setIsDrawing(true);

    if (currentTool === 'pencil') {
      drawPixel(coords.x, coords.y, currentColor);
    } else if (currentTool === 'eraser') {
      erasePixel(coords.x, coords.y);
    } else if (currentTool === 'fill') {
      fillArea(coords.x, coords.y, currentColor);
    } else if (currentTool === 'eyedropper') {
      pickColor(coords.x, coords.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoords(e);
    if (!coords) return;

    // Draw hover grid on overlay canvas
    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      const ctx = overlayCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(coords.x * scale, coords.y * scale, scale * brushSize, scale * brushSize);
      }
    }

    if (!isDrawing) return;

    if (currentTool === 'pencil') {
      drawPixel(coords.x, coords.y, currentColor);
    } else if (currentTool === 'eraser') {
      erasePixel(coords.x, coords.y);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="skin-editor">
      <div className="editor-toolbar">
        <div className="tool-buttons">
          <button
            className={currentTool === 'pencil' ? 'active' : ''}
            onClick={() => setCurrentTool('pencil')}
            title="Pencil (P)"
          >
            ✏️
          </button>
          <button
            className={currentTool === 'eraser' ? 'active' : ''}
            onClick={() => setCurrentTool('eraser')}
            title="Eraser (E)"
          >
            🧹
          </button>
          <button
            className={currentTool === 'fill' ? 'active' : ''}
            onClick={() => setCurrentTool('fill')}
            title="Fill (F)"
          >
            🪣
          </button>
          <button
            className={currentTool === 'eyedropper' ? 'active' : ''}
            onClick={() => setCurrentTool('eyedropper')}
            title="Eyedropper (I)"
          >
            💉
          </button>
        </div>

        <div className="color-picker">
          <label>
            Color:
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
            />
          </label>
        </div>

        <div className="brush-size">
          <label>
            Brush Size: {brushSize}
            <input
              type="range"
              min="1"
              max="8"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="canvas-container" style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            border: '2px solid #333',
            cursor: 'crosshair',
            imageRendering: 'pixelated',
          }}
        />
        <canvas
          ref={overlayCanvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>
  );
}

// Helper functions
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}
