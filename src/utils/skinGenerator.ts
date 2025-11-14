/**
 * AI-powered Minecraft skin generator
 * This module handles generating Minecraft skins from text prompts
 */

interface SkinGenerationOptions {
  prompt: string;
  apiKey?: string;
  useDemo?: boolean;
}

/**
 * Generate a Minecraft skin from a text prompt
 */
export async function generateSkinFromPrompt(
  options: SkinGenerationOptions
): Promise<string> {
  const { prompt, apiKey, useDemo = false } = options;

  if (useDemo || !apiKey) {
    // Generate a demo skin based on the prompt
    return generateDemoSkin(prompt);
  }

  // TODO: Integrate with actual AI API (Replicate, Hugging Face, etc.)
  // For now, fallback to demo generation
  return generateDemoSkin(prompt);
}

/**
 * Generate a demo skin with procedural generation based on prompt keywords
 */
function generateDemoSkin(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Clear canvas
    ctx.clearRect(0, 0, 64, 64);

    // Parse prompt to extract colors and styles
    const colors = extractColorsFromPrompt(prompt);
    const style = extractStyleFromPrompt(prompt);

    // Generate skin based on template
    drawSkinTemplate(ctx, colors, style);

    resolve(canvas.toDataURL('image/png'));
  });
}

/**
 * Extract color palette from prompt
 */
function extractColorsFromPrompt(prompt: string): {
  primary: string;
  secondary: string;
  accent: string;
  skin: string;
} {
  const lowerPrompt = prompt.toLowerCase();

  // Default colors
  let primary = '#3498db';
  let secondary = '#2c3e50';
  let accent = '#e74c3c';
  let skin = '#f4a460';

  // Detect colors from keywords
  if (lowerPrompt.includes('red') || lowerPrompt.includes('빨강')) {
    primary = '#e74c3c';
    accent = '#c0392b';
  } else if (lowerPrompt.includes('blue') || lowerPrompt.includes('파랑')) {
    primary = '#3498db';
    accent = '#2980b9';
  } else if (lowerPrompt.includes('green') || lowerPrompt.includes('초록')) {
    primary = '#2ecc71';
    accent = '#27ae60';
  } else if (lowerPrompt.includes('purple') || lowerPrompt.includes('보라')) {
    primary = '#9b59b6';
    accent = '#8e44ad';
  } else if (lowerPrompt.includes('yellow') || lowerPrompt.includes('노랑')) {
    primary = '#f1c40f';
    accent = '#f39c12';
  } else if (lowerPrompt.includes('black') || lowerPrompt.includes('검정')) {
    primary = '#2c3e50';
    accent = '#34495e';
  } else if (lowerPrompt.includes('white') || lowerPrompt.includes('하얀')) {
    primary = '#ecf0f1';
    accent = '#bdc3c7';
  }

  // Detect clothing style
  if (lowerPrompt.includes('street') || lowerPrompt.includes('스트릿')) {
    secondary = '#34495e';
  } else if (lowerPrompt.includes('formal') || lowerPrompt.includes('정장')) {
    secondary = '#2c3e50';
    primary = '#34495e';
  } else if (lowerPrompt.includes('casual') || lowerPrompt.includes('캐주얼')) {
    secondary = '#7f8c8d';
  }

  return { primary, secondary, accent, skin };
}

/**
 * Extract style information from prompt
 */
function extractStyleFromPrompt(prompt: string): {
  hasHat: boolean;
  hasGlasses: boolean;
  hasBeard: boolean;
  clothing: 'casual' | 'street' | 'formal' | 'sporty';
} {
  const lowerPrompt = prompt.toLowerCase();

  return {
    hasHat: lowerPrompt.includes('hat') || lowerPrompt.includes('모자') || lowerPrompt.includes('cap'),
    hasGlasses: lowerPrompt.includes('glasses') || lowerPrompt.includes('안경'),
    hasBeard: lowerPrompt.includes('beard') || lowerPrompt.includes('수염'),
    clothing: lowerPrompt.includes('street') || lowerPrompt.includes('스트릿')
      ? 'street'
      : lowerPrompt.includes('formal') || lowerPrompt.includes('정장')
      ? 'formal'
      : lowerPrompt.includes('sport') || lowerPrompt.includes('스포츠')
      ? 'sporty'
      : 'casual',
  };
}

/**
 * Draw a Minecraft skin template with the given colors and style
 */
function drawSkinTemplate(
  ctx: CanvasRenderingContext2D,
  colors: { primary: string; secondary: string; accent: string; skin: string },
  style: { hasHat: boolean; hasGlasses: boolean; hasBeard: boolean; clothing: string }
): void {
  // Head base (front face)
  ctx.fillStyle = colors.skin;
  ctx.fillRect(8, 8, 8, 8);   // Top of head
  ctx.fillRect(8, 16, 8, 8);  // Front face

  // Head sides
  ctx.fillStyle = darkenColor(colors.skin, 0.9);
  ctx.fillRect(0, 16, 8, 8);  // Right side
  ctx.fillRect(16, 16, 8, 8); // Left side

  // Head back
  ctx.fillStyle = darkenColor(colors.skin, 0.85);
  ctx.fillRect(24, 16, 8, 8);

  // Hair/Hat layer (second layer)
  if (style.hasHat) {
    ctx.fillStyle = colors.accent;
    ctx.fillRect(40, 8, 8, 8);  // Hat top
    ctx.fillRect(40, 16, 8, 4); // Hat front
  } else {
    // Hair
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(40, 8, 8, 8);
    ctx.fillRect(40, 16, 8, 3);
  }

  // Eyes
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(10, 18, 1, 1); // Left eye
  ctx.fillRect(13, 18, 1, 1); // Right eye

  if (style.hasGlasses) {
    ctx.fillStyle = '#34495e';
    ctx.fillRect(9, 18, 3, 2);
    ctx.fillRect(12, 18, 3, 2);
  }

  // Mouth
  ctx.fillStyle = darkenColor(colors.skin, 0.8);
  ctx.fillRect(10, 21, 4, 1);

  // Beard
  if (style.hasBeard) {
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(9, 22, 6, 2);
  }

  // Body (torso)
  ctx.fillStyle = colors.primary;
  ctx.fillRect(20, 20, 8, 12); // Front body

  // Body sides
  ctx.fillStyle = darkenColor(colors.primary, 0.9);
  ctx.fillRect(16, 20, 4, 12); // Right side
  ctx.fillRect(28, 20, 4, 12); // Left side

  // Body back
  ctx.fillStyle = darkenColor(colors.primary, 0.85);
  ctx.fillRect(32, 20, 8, 12);

  // Add clothing details
  if (style.clothing === 'street') {
    // Hoodie string
    ctx.fillStyle = colors.accent;
    ctx.fillRect(21, 21, 1, 3);
    ctx.fillRect(26, 21, 1, 3);
  } else if (style.clothing === 'formal') {
    // Tie
    ctx.fillStyle = colors.accent;
    ctx.fillRect(23, 22, 2, 6);
  }

  // Right arm
  ctx.fillStyle = colors.primary;
  ctx.fillRect(44, 20, 4, 12); // Front

  // Left arm
  ctx.fillRect(36, 52, 4, 12); // Front

  // Right leg
  ctx.fillStyle = colors.secondary;
  ctx.fillRect(4, 20, 4, 12);

  // Left leg
  ctx.fillRect(20, 52, 4, 12);

  // Add shading and details
  addSkinDetails(ctx, colors);
}

/**
 * Add details and shading to make the skin more interesting
 */
function addSkinDetails(
  ctx: CanvasRenderingContext2D,
  colors: { primary: string; secondary: string; accent: string }
): void {
  // Add some pixel art details for clothing
  ctx.fillStyle = colors.accent;

  // Shirt collar
  ctx.fillRect(20, 20, 8, 1);

  // Belt
  ctx.fillRect(20, 27, 8, 1);

  // Shoe details
  ctx.fillRect(4, 20, 4, 1);
  ctx.fillRect(20, 52, 4, 1);

  // Add some random detail pixels for texture
  const detailColor = darkenColor(colors.primary, 0.95);
  ctx.fillStyle = detailColor;

  // Random detail pixels on body
  for (let i = 0; i < 8; i++) {
    const x = 20 + Math.floor(Math.random() * 8);
    const y = 21 + Math.floor(Math.random() * 10);
    ctx.fillRect(x, y, 1, 1);
  }
}

/**
 * Darken a hex color by a factor (0-1)
 */
function darkenColor(color: string, factor: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.floor(r * factor);
  const newG = Math.floor(g * factor);
  const newB = Math.floor(b * factor);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Convert an image to Minecraft skin format
 * This function takes a regular image and converts it to 64x64 pixel art
 */
export async function convertImageToSkin(imageData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw and scale image to 64x64
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, 64, 64);

      // Apply pixelation effect
      const imageDataObj = ctx.getImageData(0, 0, 64, 64);
      const data = imageDataObj.data;

      // Simple posterization for pixel art effect
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round(data[i] / 32) * 32;     // R
        data[i + 1] = Math.round(data[i + 1] / 32) * 32; // G
        data[i + 2] = Math.round(data[i + 2] / 32) * 32; // B
      }

      ctx.putImageData(imageDataObj, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
}
