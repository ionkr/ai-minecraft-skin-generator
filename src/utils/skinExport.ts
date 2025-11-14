/**
 * Export a skin as a PNG file
 */
export function exportSkinAsPNG(imageData: string, filename: string = 'minecraft_skin.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = imageData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Create a canvas with the given image data
 */
export function createCanvasFromImage(imageData: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
}

/**
 * Convert canvas to base64 PNG data URL
 */
export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Create a blank 64x64 Minecraft skin template
 */
export function createBlankSkin(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Fill with transparent background
    ctx.clearRect(0, 0, 64, 64);

    // Optional: Draw a basic skin template outline for reference
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';

    // Head (front and sides)
    ctx.fillRect(8, 8, 8, 8);   // Top
    ctx.fillRect(8, 16, 8, 8);  // Front
    ctx.fillRect(0, 16, 8, 8);  // Right
    ctx.fillRect(16, 16, 8, 8); // Left
    ctx.fillRect(24, 16, 8, 8); // Back
    ctx.fillRect(16, 8, 8, 8);  // Bottom
  }

  return canvas.toDataURL('image/png');
}
