import { useEffect, useRef } from 'react';
import * as skinview3d from 'skinview3d';

interface SkinViewer3DProps {
  skinData: string;
  width?: number;
  height?: number;
  autoRotate?: boolean;
}

export function SkinViewer3D({
  skinData,
  width = 300,
  height = 400,
  autoRotate = true,
}: SkinViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<skinview3d.SkinViewer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the skin viewer
    const viewer = new skinview3d.SkinViewer({
      canvas: canvasRef.current,
      width,
      height,
      skin: skinData,
    });

    // Configure viewer settings
    viewer.animation = new skinview3d.WalkingAnimation();
    viewer.animation.speed = 0.5;

    if (autoRotate) {
      viewer.autoRotate = true;
      viewer.autoRotateSpeed = 1;
    }

    // Camera settings
    viewer.zoom = 0.7;
    viewer.fov = 70;

    // Enable controls
    viewer.controls.enableRotate = true;
    viewer.controls.enableZoom = true;
    viewer.controls.enablePan = false;

    viewerRef.current = viewer;

    // Cleanup
    return () => {
      viewer.dispose();
    };
  }, [skinData, width, height, autoRotate]);

  return (
    <div className="skin-viewer-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
