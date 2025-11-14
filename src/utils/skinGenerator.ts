/**
 * AI-powered Minecraft skin generator
 * This module handles generating Minecraft skins from text prompts using Anthropic's Claude API
 */

import Anthropic from '@anthropic-ai/sdk';

interface SkinGenerationOptions {
  prompt: string;
  apiKey?: string;
  useDemo?: boolean;
}

interface SkinColorScheme {
  head: {
    skin: string;
    hair: string;
    hairHighlight?: string;
    hairShadow?: string;
    eyes: string;
    eyeDetail?: string;
    eyebrows?: string;
    mouth?: string;
    nose?: string;
    blush?: string;
    accessories?: Array<{ color: string; area: string }>;
  };
  body: {
    primary: string;
    secondary: string;
    accent?: string;
    pattern?: string;
    collar?: string;
    pockets?: string;
    belt?: string;
    details?: Array<{ color: string; type: string }>;
  };
  arms: {
    skin: string;
    clothing: string;
    detail?: string;
    sleeveTrim?: string;
    watch?: string;
  };
  legs: {
    primary: string;
    secondary: string;
    shoes?: string;
    shoeLaces?: string;
    shoesSole?: string;
    kneePads?: string;
    pockets?: string;
    belt?: string;
  };
  accessories?: {
    hat?: { color: string; style: string; detail?: string };
    glasses?: { color: string; frame?: string };
    beard?: { color: string; highlight?: string };
    backpack?: { color: string; straps?: string };
    necklace?: { color: string };
    earrings?: { color: string };
  };
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

  try {
    // Use Anthropic API to generate skin color scheme
    const colorScheme = await generateColorSchemeWithAI(prompt, apiKey);
    return generateSkinFromColorScheme(colorScheme);
  } catch (error) {
    console.error('AI generation failed, falling back to demo:', error);
    return generateDemoSkin(prompt);
  }
}

/**
 * Generate a color scheme using Anthropic's Claude API
 */
async function generateColorSchemeWithAI(
  prompt: string,
  apiKey: string
): Promise<SkinColorScheme> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const systemPrompt = `You are an expert Minecraft skin designer with deep knowledge of pixel art and character design. Generate HIGHLY DETAILED color schemes for Minecraft skins based on user descriptions.

CRITICAL: Minecraft skins are 3D and viewed from ALL ANGLES (front, back, left, right, top, bottom). Every surface must have EQUAL detail and visual interest. The back and sides are just as important as the front!

IMPORTANT: Minecraft skins use a 64x64 pixel layout with specific UV mapping:
- Head: 8x8x8 pixels with 6 faces (front, back, left, right, top, bottom)
- Body/Torso: 8x12 pixels with 6 faces (front, back, left, right, top, bottom)
- Arms: 4x12 pixels each with 6 faces per arm
- Legs: 4x12 pixels each with 6 faces per leg
- Second layer (overlays) for hat, jacket, sleeves, pants - ALL surfaces need detail!

CREATE RICH, DETAILED DESIGNS with multiple colors and layers for EVERY SURFACE. Your response MUST be valid JSON following this exact structure:
{
  "head": {
    "skin": "#hexcolor",
    "hair": "#hexcolor",
    "hairHighlight": "#hexcolor (REQUIRED - add highlights for depth)",
    "hairShadow": "#hexcolor (optional - darker shade for hair depth)",
    "eyes": "#hexcolor",
    "eyeDetail": "#hexcolor (REQUIRED - pupil or iris detail)",
    "eyebrows": "#hexcolor (optional - add character expression)",
    "mouth": "#hexcolor (REQUIRED - lip color)",
    "nose": "#hexcolor (optional - subtle nose shading)",
    "blush": "#hexcolor (optional - cheek color for warmth)",
    "accessories": [
      { "color": "#hexcolor", "area": "description" }
    ]
  },
  "body": {
    "primary": "#hexcolor (main clothing)",
    "secondary": "#hexcolor (secondary clothing)",
    "accent": "#hexcolor (REQUIRED - buttons, zippers, trim)",
    "pattern": "#hexcolor (optional - stripes, logos, designs)",
    "collar": "#hexcolor (optional - shirt/jacket collar)",
    "pockets": "#hexcolor (optional - pocket details)",
    "belt": "#hexcolor (optional - belt or waistband)",
    "details": [
      { "color": "#hexcolor", "type": "stripe|logo|button|zipper|seam" }
    ]
  },
  "arms": {
    "skin": "#hexcolor",
    "clothing": "#hexcolor",
    "detail": "#hexcolor (REQUIRED - sleeve trim, cuffs, patterns)",
    "sleeveTrim": "#hexcolor (optional - sleeve end detail)",
    "watch": "#hexcolor (optional - wrist accessory)"
  },
  "legs": {
    "primary": "#hexcolor (pants/main)",
    "secondary": "#hexcolor (secondary)",
    "shoes": "#hexcolor (REQUIRED - footwear color - VERY IMPORTANT for overall look)",
    "shoeLaces": "#hexcolor (HIGHLY RECOMMENDED - shoe lace detail adds realism)",
    "shoesSole": "#hexcolor (HIGHLY RECOMMENDED - shoe sole/bottom for depth)",
    "kneePads": "#hexcolor (optional - knee details)",
    "pockets": "#hexcolor (optional - pants pockets)",
    "belt": "#hexcolor (optional - pants belt)"
  },
  "accessories": {
    "hat": { "color": "#hexcolor", "style": "cap|beanie|hood|none", "detail": "#hexcolor (optional)" },
    "glasses": { "color": "#hexcolor", "frame": "#hexcolor (optional)" },
    "beard": { "color": "#hexcolor", "highlight": "#hexcolor (optional)" },
    "backpack": { "color": "#hexcolor", "straps": "#hexcolor (optional)" },
    "necklace": { "color": "#hexcolor" },
    "earrings": { "color": "#hexcolor" }
  }
}

CRITICAL DESIGN GUIDELINES:
1. **ALL SURFACES MATTER** - Design details for EVERY angle: front, back, sides, top, bottom. The back of the head should have hair texture, the back of the body should have clothing details (logos, patterns, hoods), sides need seams and panels
2. USE CONTRASTING COLORS - Ensure different clothing elements have distinct colors for visual interest on ALL surfaces
3. ADD DEPTH - Always provide highlight and shadow colors for 3D effect on EVERY face
4. INCLUDE DETAILS - Add small accent colors for buttons, trim, pockets, seams, etc. on front AND back
5. BE SPECIFIC - If the prompt mentions a character or style, match their iconic colors accurately on all surfaces
6. CREATE TEXTURE - Use multiple shades of the same color family for richness across all areas
7. FACIAL FEATURES - Always define eyebrows, nose shading, and blush for more expressive faces
8. CLOTHING COMPLEXITY - Add patterns, logos, stripes, or textures to clothing on FRONT, BACK, and SIDES
9. REALISTIC SHADING - Use darker variants for shadows (multiply base color by 0.7-0.8) on all faces
10. HIGHLIGHTS - Use lighter variants for highlights (multiply base color by 1.2-1.4, cap at 255)
11. **BACK DETAILS** - The back of clothing should have: collar continuation, back pockets, logos, hood details, jacket seams, belt loops
12. **SIDE DETAILS** - Sides should have: sleeve seams, pants seams, color panels, racing stripes
13. **HAIR FROM ALL ANGLES** - Hair should have highlights/shadows on top, sides, and back - not just front
14. **SHOE DETAILS ARE CRITICAL** - Shoes occupy the bottom 4 pixels of legs (coordinates 28-32 for right, 60-64 for left) and are HIGHLY VISIBLE in 3D view. ALWAYS include:
    * Base shoe color (shoes field - REQUIRED)
    * Contrasting laces (shoeLaces field - HIGHLY RECOMMENDED)
    * Different colored sole (shoesSole field - HIGHLY RECOMMENDED for depth)
    * For branded shoes (Nike, Adidas, etc.), use accent colors to suggest logos/swooshes
    * Common combinations: white shoes + black laces + gum sole, black shoes + white laces + black sole, red shoes + white laces + white sole

EXAMPLES OF GOOD DETAIL (ALL ANGLES):
- A "ninja" should have:
  * Front: Face mask, weapon belt with buckle
  * Back: Sword/shuriken holder, back belt straps
  * Sides: Armor plates, side belt details
  * Hair: Black with subtle blue highlights on all sides
  * Shoes: Black ninja boots with straps/wraps, darker sole
- A "firefighter" should have:
  * Front: Yellow reflective stripes, badge, buttons
  * Back: "FIRE DEPT" text or logo, reflective X pattern
  * Sides: Side pockets, reflective vertical stripes
  * Helmet: Yellow/red on all sides with visor detail
  * Boots: Black heavy-duty boots, yellow reflective strip, thick rubber sole
- A "casual teenager" should have:
  * Front: Hoodie with logo, drawstrings, front pocket
  * Back: Hoodie with back graphic/text, hood detail
  * Sides: Hoodie side panels in contrasting color, sleeve cuffs
  * Jeans: Front pockets, back pockets, side seams with contrasting thread
  * Sneakers: White/colored shoes with contrasting laces and sole (e.g., white body, black laces, gum sole)
- A "wizard with NIKE shoes" should have:
  * Robe: Purple/blue flowing robe with mystical patterns
  * Hat: Pointed wizard hat with stars/moons
  * Shoes: White/colorful sneakers (NIKE style) with swoosh-like accent, colored laces, contrasting sole
  * Staff accessory or magical details on clothing

Be MAXIMALLY creative and detailed! Fill in ALL optional fields when they enhance the design. Remember: players will see your skin from EVERY angle!`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    temperature: 1.0,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Generate a detailed Minecraft skin color scheme for: "${prompt}"\n\nProvide ONLY the JSON response, no additional text.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from API');
  }

  let jsonText = content.text.trim();

  // Extract JSON if wrapped in markdown code blocks
  const jsonMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1].trim();
  }

  const colorScheme = JSON.parse(jsonText) as SkinColorScheme;
  return colorScheme;
}

/**
 * Generate skin image from color scheme
 */
function generateSkinFromColorScheme(scheme: SkinColorScheme): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Clear canvas with transparency
    ctx.clearRect(0, 0, 64, 64);

    // Draw skin based on color scheme with detailed pixel art
    drawDetailedSkin(ctx, scheme);

    resolve(canvas.toDataURL('image/png'));
  });
}

/**
 * Draw a detailed Minecraft skin from AI-generated color scheme
 * Follows the official Minecraft 64x64 skin template layout
 */
function drawDetailedSkin(ctx: CanvasRenderingContext2D, scheme: SkinColorScheme): void {
  // ===== HEAD (8x8x8 pixels) =====

  // Head - Top (8,0 to 16,8)
  ctx.fillStyle = darkenColor(scheme.head.skin, 0.95);
  ctx.fillRect(8, 0, 8, 8);

  // Head - Bottom (16,0 to 24,8)
  ctx.fillStyle = darkenColor(scheme.head.skin, 0.85);
  ctx.fillRect(16, 0, 8, 8);

  // Head - Right side (0,8 to 8,16)
  ctx.fillStyle = darkenColor(scheme.head.skin, 0.9);
  ctx.fillRect(0, 8, 8, 8);

  // Head - Front face (8,8 to 16,16)
  ctx.fillStyle = scheme.head.skin;
  ctx.fillRect(8, 8, 8, 8);

  // Head - Left side (16,8 to 24,16)
  ctx.fillStyle = darkenColor(scheme.head.skin, 0.9);
  ctx.fillRect(16, 8, 8, 8);

  // Head - Back (24,8 to 32,16)
  ctx.fillStyle = darkenColor(scheme.head.skin, 0.85);
  ctx.fillRect(24, 8, 8, 8);

  // Add hair/skin shading to back of head
  if (scheme.head.nose) {
    // Add subtle skin shading to back of head
    ctx.fillStyle = darkenColor(scheme.head.skin, 0.8);
    ctx.fillRect(25, 12, 6, 3);
  }

  // Eyebrows
  if (scheme.head.eyebrows) {
    ctx.fillStyle = scheme.head.eyebrows;
    ctx.fillRect(10, 9, 2, 1); // Left eyebrow
    ctx.fillRect(14, 9, 2, 1); // Right eyebrow
  }

  // Eyes (on front face)
  ctx.fillStyle = scheme.head.eyes;
  ctx.fillRect(10, 10, 2, 2); // Left eye
  ctx.fillRect(14, 10, 2, 2); // Right eye

  // Eye details (pupils/iris)
  if (scheme.head.eyeDetail) {
    ctx.fillStyle = scheme.head.eyeDetail;
    ctx.fillRect(10, 10, 1, 1); // Left pupil
    ctx.fillRect(14, 10, 1, 1); // Right pupil
    // Add eye shine for more life
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(11, 10, 1, 1); // Left eye shine
    ctx.fillRect(15, 10, 1, 1); // Right eye shine
  }

  // Nose
  if (scheme.head.nose) {
    ctx.fillStyle = scheme.head.nose;
    ctx.fillRect(12, 12, 1, 2); // Nose bridge
    ctx.fillRect(11, 13, 1, 1); // Left nostril
    ctx.fillRect(13, 13, 1, 1); // Right nostril
  }

  // Blush/cheeks
  if (scheme.head.blush) {
    ctx.fillStyle = scheme.head.blush;
    ctx.fillRect(9, 12, 2, 1); // Left cheek
    ctx.fillRect(15, 12, 2, 1); // Right cheek
  }

  // Mouth
  if (scheme.head.mouth) {
    ctx.fillStyle = scheme.head.mouth;
    ctx.fillRect(10, 13, 4, 1); // Upper lip
    ctx.fillRect(11, 14, 2, 1); // Lower lip
    // Add subtle mouth corners for expression
    ctx.fillRect(10, 14, 1, 1); // Left corner
    ctx.fillRect(13, 14, 1, 1); // Right corner
  }

  // Beard (if applicable)
  if (scheme.accessories?.beard) {
    ctx.fillStyle = scheme.accessories.beard.color;
    ctx.fillRect(9, 14, 6, 2);
    // Add to sides
    ctx.fillRect(1, 14, 6, 2);
    ctx.fillRect(17, 14, 6, 2);
  }

  // ===== HAIR/HAT LAYER (Second layer - overlay) =====
  // Hat layer - Top (40,0 to 48,8)
  ctx.fillStyle = scheme.head.hair;
  ctx.fillRect(40, 0, 8, 8);

  // Hat layer - Bottom (48,0 to 56,8)
  ctx.fillRect(48, 0, 8, 8);

  // Hat layer - Right (32,8 to 40,16)
  // Only draw hair on top part, leave face visible
  ctx.fillStyle = darkenColor(scheme.head.hair, 0.9);
  ctx.fillRect(32, 8, 8, 4);

  // Hat layer - Front (40,8 to 48,16)
  // Only draw hair on top part, leave face area (eyes/mouth) transparent
  ctx.fillStyle = scheme.head.hair;
  ctx.fillRect(40, 8, 8, 4); // Only top half (hair), not covering face

  // Hair details - shadows first
  if (scheme.head.hairShadow) {
    ctx.fillStyle = scheme.head.hairShadow;
    // Add shadow pixels for depth
    for (let i = 0; i < 8; i++) {
      const x = 40 + Math.floor(Math.random() * 8);
      const y = 4 + Math.floor(Math.random() * 4); // Bottom half
      ctx.fillRect(x, y, 1, 1);
    }
    // Add shadows on sides
    ctx.fillRect(32, 12, 8, 4); // Right side shadow
    ctx.fillRect(48, 12, 8, 4); // Left side shadow
  }

  // Hair highlights
  if (scheme.head.hairHighlight) {
    ctx.fillStyle = scheme.head.hairHighlight;
    // Add highlight pixels on top part (avoid face area)
    for (let i = 0; i < 10; i++) {
      const x = 40 + Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 4); // Top area (0-4)
      ctx.fillRect(x, y, 1, 1);
    }
    // Highlight strands on front hair area only (not face)
    for (let i = 0; i < 5; i++) {
      const x = 40 + Math.floor(Math.random() * 8);
      const y = 8 + Math.floor(Math.random() * 4); // Keep in hair area (8-12)
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Hat layer - Left (48,8 to 56,16)
  // Only draw hair on top part to avoid covering face in 3D view
  ctx.fillStyle = darkenColor(scheme.head.hair, 0.9);
  ctx.fillRect(48, 8, 8, 4);

  // Hat layer - Back (56,8 to 64,16)
  // Only draw hair on top part to avoid covering face in 3D view
  ctx.fillStyle = darkenColor(scheme.head.hair, 0.85);
  ctx.fillRect(56, 8, 8, 4);

  // Add hair texture to back of head (important!)
  if (scheme.head.hairHighlight) {
    ctx.fillStyle = lightenColor(darkenColor(scheme.head.hair, 0.85), 1.15);
    // Back hair highlights
    for (let i = 0; i < 8; i++) {
      const x = 56 + Math.floor(Math.random() * 8);
      const y = 8 + Math.floor(Math.random() * 4);
      ctx.fillRect(x, y, 1, 1);
    }
  }

  if (scheme.head.hairShadow) {
    ctx.fillStyle = darkenColor(scheme.head.hairShadow, 0.85);
    // Back hair shadows
    for (let i = 0; i < 6; i++) {
      const x = 56 + Math.floor(Math.random() * 8);
      const y = 10 + Math.floor(Math.random() * 2);
      ctx.fillRect(x, y, 1, 1);
    }
    // Add full back lower hair layer
    ctx.fillRect(56, 12, 8, 4);
  }

  // Hat accessory
  if (scheme.accessories?.hat) {
    ctx.fillStyle = scheme.accessories.hat.color;
    if (scheme.accessories.hat.style === 'cap') {
      ctx.fillRect(40, 8, 8, 3); // Cap brim
    } else if (scheme.accessories.hat.style === 'beanie') {
      ctx.fillRect(40, 0, 8, 8); // Full coverage
    }
  }

  // Glasses
  if (scheme.accessories?.glasses) {
    ctx.fillStyle = scheme.accessories.glasses.color;
    ctx.fillRect(9, 10, 3, 2); // Left lens
    ctx.fillRect(14, 10, 3, 2); // Right lens
    ctx.fillRect(12, 10, 2, 1); // Bridge
  }

  // ===== BODY/TORSO (8x12 pixels) =====

  // Body - Top (20,16 to 28,20)
  ctx.fillStyle = darkenColor(scheme.body.primary, 0.95);
  ctx.fillRect(20, 16, 8, 4);

  // Body - Bottom (28,16 to 36,20)
  ctx.fillStyle = darkenColor(scheme.body.primary, 0.85);
  ctx.fillRect(28, 16, 8, 4);

  // Body - Right side (16,20 to 20,32)
  ctx.fillStyle = darkenColor(scheme.body.primary, 0.9);
  ctx.fillRect(16, 20, 4, 12);

  // Add details to right side
  if (scheme.body.secondary) {
    ctx.fillStyle = darkenColor(scheme.body.secondary, 0.9);
    // Side panel stripe
    ctx.fillRect(17, 20, 2, 12);
  }
  if (scheme.body.accent) {
    ctx.fillStyle = darkenColor(scheme.body.accent, 0.9);
    // Side seam
    ctx.fillRect(16, 20, 1, 12);
    // Side details
    ctx.fillRect(18, 25, 1, 3);
  }

  // Body - Front (20,20 to 28,32)
  ctx.fillStyle = scheme.body.primary;
  ctx.fillRect(20, 20, 8, 12);

  // Body - Left side (28,20 to 32,32)
  ctx.fillStyle = darkenColor(scheme.body.primary, 0.9);
  ctx.fillRect(28, 20, 4, 12);

  // Add details to left side
  if (scheme.body.secondary) {
    ctx.fillStyle = darkenColor(scheme.body.secondary, 0.9);
    // Side panel stripe
    ctx.fillRect(29, 20, 2, 12);
  }
  if (scheme.body.accent) {
    ctx.fillStyle = darkenColor(scheme.body.accent, 0.9);
    // Side seam
    ctx.fillRect(31, 20, 1, 12);
    // Side details
    ctx.fillRect(29, 25, 1, 3);
  }

  // Body - Back (32,20 to 40,32)
  ctx.fillStyle = darkenColor(scheme.body.primary, 0.85);
  ctx.fillRect(32, 20, 8, 12);

  // Add details to body back (important for 3D view!)
  // Pattern on back (if exists)
  if (scheme.body.pattern) {
    ctx.fillStyle = darkenColor(scheme.body.pattern, 0.85);
    // Horizontal stripes on back
    ctx.fillRect(32, 22, 8, 1);
    ctx.fillRect(32, 24, 8, 1);
    ctx.fillRect(32, 26, 8, 1);
    // Or back logo/design
    ctx.fillRect(34, 21, 4, 4);
  }

  // Secondary color on back sides
  if (scheme.body.secondary) {
    ctx.fillStyle = darkenColor(scheme.body.secondary, 0.85);
    ctx.fillRect(32, 20, 2, 12); // Left back panel
    ctx.fillRect(38, 20, 2, 12); // Right back panel
  }

  // Accent details on back (center seam, back pockets)
  if (scheme.body.accent) {
    ctx.fillStyle = darkenColor(scheme.body.accent, 0.85);
    // Center back seam
    ctx.fillRect(35, 20, 1, 12);
    ctx.fillRect(36, 20, 1, 12);
    // Back pocket outlines
    ctx.fillRect(33, 25, 2, 3);
    ctx.fillRect(37, 25, 2, 3);
  }

  // Belt on back
  if (scheme.body.belt) {
    ctx.fillStyle = darkenColor(scheme.body.belt, 0.85);
    ctx.fillRect(32, 30, 8, 2);
  }

  // Collar detail
  if (scheme.body.collar) {
    ctx.fillStyle = scheme.body.collar;
    ctx.fillRect(20, 20, 8, 2); // Collar area
    ctx.fillRect(19, 21, 2, 1); // Collar tips on sides
    ctx.fillRect(27, 21, 2, 1);
  }

  // Pockets
  if (scheme.body.pockets) {
    ctx.fillStyle = scheme.body.pockets;
    ctx.fillRect(21, 25, 2, 3); // Left pocket
    ctx.fillRect(25, 25, 2, 3); // Right pocket
    // Pocket stitching
    ctx.fillRect(21, 25, 2, 1);
    ctx.fillRect(25, 25, 2, 1);
  }

  // Belt
  if (scheme.body.belt) {
    ctx.fillStyle = scheme.body.belt;
    ctx.fillRect(20, 30, 8, 2); // Belt across waist
    // Belt buckle
    ctx.fillStyle = lightenColor(scheme.body.belt, 1.3);
    ctx.fillRect(23, 30, 2, 2);
  }

  // Pattern (stripes, logos, etc.)
  if (scheme.body.pattern) {
    ctx.fillStyle = scheme.body.pattern;
    // Horizontal stripes
    ctx.fillRect(20, 22, 8, 1);
    ctx.fillRect(20, 24, 8, 1);
    ctx.fillRect(20, 26, 8, 1);
  }

  // Accent details (buttons, zipper, trim)
  if (scheme.body.accent) {
    ctx.fillStyle = scheme.body.accent;
    // Buttons or zipper down center
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(23, 21 + i * 2, 1, 1);
      ctx.fillRect(24, 21 + i * 2, 1, 1);
    }
    // Sleeve seams
    ctx.fillRect(20, 20, 1, 12); // Left seam
    ctx.fillRect(27, 20, 1, 12); // Right seam
  }

  // Secondary color details
  if (scheme.body.secondary) {
    ctx.fillStyle = scheme.body.secondary;
    // Side panels
    ctx.fillRect(20, 20, 2, 12); // Left panel
    ctx.fillRect(26, 20, 2, 12); // Right panel
  }

  // Additional clothing details from AI
  if (scheme.body.details) {
    scheme.body.details.forEach((detail, index) => {
      ctx.fillStyle = detail.color;
      // Add details based on type
      if (detail.type === 'button') {
        ctx.fillRect(23, 21 + index * 2, 1, 1);
      } else if (detail.type === 'stripe') {
        ctx.fillRect(20, 22 + index * 2, 8, 1);
      } else if (detail.type === 'logo') {
        // Small logo area
        ctx.fillRect(21, 21, 3, 3);
      }
    });
  }

  // ===== ARMS (4x12 pixels each) =====

  // Right Arm - Top (44,16 to 48,20)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.95);
  ctx.fillRect(44, 16, 4, 4);

  // Right Arm - Bottom (48,16 to 52,20)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.85);
  ctx.fillRect(48, 16, 4, 4);

  // Right Arm - Right side (40,20 to 44,32)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.9);
  ctx.fillRect(40, 20, 4, 12);

  // Right Arm - Front (44,20 to 48,32)
  ctx.fillStyle = scheme.arms.clothing;
  ctx.fillRect(44, 20, 4, 12);

  // Right Arm - Left side (48,20 to 52,32)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.9);
  ctx.fillRect(48, 20, 4, 12);

  // Right Arm - Back (52,20 to 56,32)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.85);
  ctx.fillRect(52, 20, 4, 12);

  // Add details to arm back
  if (scheme.arms.detail) {
    ctx.fillStyle = darkenColor(scheme.arms.detail, 0.85);
    // Back sleeve details
    ctx.fillRect(52, 20, 4, 2);
    ctx.fillRect(53, 25, 2, 1);
  }

  // Arm details
  if (scheme.arms.detail) {
    ctx.fillStyle = scheme.arms.detail;
    // Sleeve details/patterns
    ctx.fillRect(44, 20, 4, 2); // Sleeve trim at top
    ctx.fillRect(44, 25, 4, 1); // Mid-sleeve detail
  }

  // Sleeve trim at wrist
  if (scheme.arms.sleeveTrim) {
    ctx.fillStyle = scheme.arms.sleeveTrim;
    ctx.fillRect(44, 27, 4, 1); // Wrist trim
    ctx.fillRect(40, 27, 4, 1); // Side wrist trim
  }

  // Hand (skin color at bottom of arm)
  ctx.fillStyle = scheme.arms.skin;
  ctx.fillRect(44, 28, 4, 4); // Front
  ctx.fillRect(40, 28, 4, 4); // Right side
  ctx.fillRect(48, 28, 4, 4); // Left side
  ctx.fillRect(52, 28, 4, 4); // Back

  // Watch/bracelet on wrist
  if (scheme.arms.watch) {
    ctx.fillStyle = scheme.arms.watch;
    ctx.fillRect(44, 28, 4, 1); // Watch band
    ctx.fillRect(45, 28, 2, 2); // Watch face
  }

  // Left Arm - Top (36,48 to 40,52)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.95);
  ctx.fillRect(36, 48, 4, 4);

  // Left Arm - Bottom (40,48 to 44,52)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.85);
  ctx.fillRect(40, 48, 4, 4);

  // Left Arm - Right side (32,52 to 36,64)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.9);
  ctx.fillRect(32, 52, 4, 12);

  // Left Arm - Front (36,52 to 40,64)
  ctx.fillStyle = scheme.arms.clothing;
  ctx.fillRect(36, 52, 4, 12);

  // Left Arm - Left side (40,52 to 44,64)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.9);
  ctx.fillRect(40, 52, 4, 12);

  // Left Arm - Back (44,52 to 48,64)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.85);
  ctx.fillRect(44, 52, 4, 12);

  // Add details to left arm back
  if (scheme.arms.detail) {
    ctx.fillStyle = darkenColor(scheme.arms.detail, 0.85);
    // Back sleeve details
    ctx.fillRect(44, 52, 4, 2);
    ctx.fillRect(45, 57, 2, 1);
  }

  // Left arm details
  if (scheme.arms.detail) {
    ctx.fillStyle = scheme.arms.detail;
    ctx.fillRect(36, 52, 4, 2); // Sleeve trim at top
    ctx.fillRect(36, 57, 4, 1); // Mid-sleeve detail
  }

  // Left sleeve trim at wrist
  if (scheme.arms.sleeveTrim) {
    ctx.fillStyle = scheme.arms.sleeveTrim;
    ctx.fillRect(36, 59, 4, 1); // Wrist trim
    ctx.fillRect(32, 59, 4, 1); // Side wrist trim
  }

  // Hand
  ctx.fillStyle = scheme.arms.skin;
  ctx.fillRect(36, 60, 4, 4); // Front
  ctx.fillRect(32, 60, 4, 4); // Right side
  ctx.fillRect(40, 60, 4, 4); // Left side
  ctx.fillRect(44, 60, 4, 4); // Back

  // Watch on left hand too (if applicable)
  if (scheme.arms.watch) {
    ctx.fillStyle = scheme.arms.watch;
    ctx.fillRect(36, 60, 4, 1);
  }

  // ===== LEGS (4x12 pixels each) =====

  // Right Leg - Top (4,16 to 8,20)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.95);
  ctx.fillRect(4, 16, 4, 4);

  // Right Leg - Bottom (8,16 to 12,20)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.85);
  ctx.fillRect(8, 16, 4, 4);

  // Right Leg - Right side (0,20 to 4,32)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.9);
  ctx.fillRect(0, 20, 4, 12);

  // Add details to right leg right side
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.9);
    // Side stripe
    ctx.fillRect(1, 20, 2, 12);
  }

  // Right Leg - Front (4,20 to 8,32)
  ctx.fillStyle = scheme.legs.primary;
  ctx.fillRect(4, 20, 4, 12);

  // Right Leg - Left side (8,20 to 12,32)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.9);
  ctx.fillRect(8, 20, 4, 12);

  // Add details to right leg left side
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.9);
    // Side stripe
    ctx.fillRect(9, 20, 2, 12);
  }

  // Right Leg - Back (12,20 to 16,32)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.85);
  ctx.fillRect(12, 20, 4, 12);

  // Add details to right leg back
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.85);
    // Back seam/panel
    ctx.fillRect(13, 20, 2, 12);
  }
  if (scheme.legs.pockets) {
    ctx.fillStyle = darkenColor(scheme.legs.pockets, 0.85);
    // Back pocket
    ctx.fillRect(13, 22, 2, 3);
  }

  // Leg pockets
  if (scheme.legs.pockets) {
    ctx.fillStyle = scheme.legs.pockets;
    ctx.fillRect(5, 22, 2, 3); // Right leg pocket
  }

  // Knee pads or details
  if (scheme.legs.kneePads) {
    ctx.fillStyle = scheme.legs.kneePads;
    ctx.fillRect(4, 24, 4, 2); // Knee area
  }

  // Pants belt
  if (scheme.legs.belt) {
    ctx.fillStyle = scheme.legs.belt;
    ctx.fillRect(4, 20, 4, 1); // Belt at waist
  }

  // Shoe on right leg
  if (scheme.legs.shoes) {
    ctx.fillStyle = scheme.legs.shoes;
    ctx.fillRect(4, 28, 4, 4);   // Front
    ctx.fillRect(0, 28, 4, 4);   // Right side
    ctx.fillRect(8, 28, 4, 4);   // Left side
    ctx.fillRect(12, 28, 4, 4);  // Back

    // Shoe laces
    if (scheme.legs.shoeLaces) {
      ctx.fillStyle = scheme.legs.shoeLaces;
      ctx.fillRect(5, 28, 2, 2); // Laces area
      ctx.fillRect(5, 29, 1, 1);
      ctx.fillRect(6, 28, 1, 1);
    }

    // Shoe sole
    if (scheme.legs.shoesSole) {
      ctx.fillStyle = scheme.legs.shoesSole;
      ctx.fillRect(4, 31, 4, 1); // Bottom sole line
      ctx.fillRect(8, 31, 4, 1); // Side sole
    }
  }

  // Left Leg - Top (20,48 to 24,52)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.95);
  ctx.fillRect(20, 48, 4, 4);

  // Left Leg - Bottom (24,48 to 28,52)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.85);
  ctx.fillRect(24, 48, 4, 4);

  // Left Leg - Right side (16,52 to 20,64)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.9);
  ctx.fillRect(16, 52, 4, 12);

  // Add details to left leg right side
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.9);
    // Side stripe
    ctx.fillRect(17, 52, 2, 12);
  }

  // Left Leg - Front (20,52 to 24,64)
  ctx.fillStyle = scheme.legs.primary;
  ctx.fillRect(20, 52, 4, 12);

  // Left Leg - Left side (24,52 to 28,64)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.9);
  ctx.fillRect(24, 52, 4, 12);

  // Add details to left leg left side
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.9);
    // Side stripe
    ctx.fillRect(25, 52, 2, 12);
  }

  // Left Leg - Back (28,52 to 32,64)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.85);
  ctx.fillRect(28, 52, 4, 12);

  // Add details to left leg back
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.85);
    // Back seam/panel
    ctx.fillRect(29, 52, 2, 12);
  }
  if (scheme.legs.pockets) {
    ctx.fillStyle = darkenColor(scheme.legs.pockets, 0.85);
    // Back pocket
    ctx.fillRect(29, 54, 2, 3);
  }

  // Left leg pockets
  if (scheme.legs.pockets) {
    ctx.fillStyle = scheme.legs.pockets;
    ctx.fillRect(21, 54, 2, 3); // Left leg pocket
  }

  // Left knee pads or details
  if (scheme.legs.kneePads) {
    ctx.fillStyle = scheme.legs.kneePads;
    ctx.fillRect(20, 56, 4, 2); // Knee area
  }

  // Left pants belt
  if (scheme.legs.belt) {
    ctx.fillStyle = scheme.legs.belt;
    ctx.fillRect(20, 52, 4, 1); // Belt at waist
  }

  // Shoe on left leg
  if (scheme.legs.shoes) {
    ctx.fillStyle = scheme.legs.shoes;
    ctx.fillRect(20, 60, 4, 4);  // Front
    ctx.fillRect(16, 60, 4, 4);  // Right side
    ctx.fillRect(24, 60, 4, 4);  // Left side
    ctx.fillRect(28, 60, 4, 4);  // Back

    // Shoe laces
    if (scheme.legs.shoeLaces) {
      ctx.fillStyle = scheme.legs.shoeLaces;
      ctx.fillRect(21, 60, 2, 2); // Laces area
      ctx.fillRect(21, 61, 1, 1);
      ctx.fillRect(22, 60, 1, 1);
    }

    // Shoe sole
    if (scheme.legs.shoesSole) {
      ctx.fillStyle = scheme.legs.shoesSole;
      ctx.fillRect(20, 63, 4, 1); // Bottom sole line
      ctx.fillRect(24, 63, 4, 1); // Side sole
    }
  }

  // ===== SECOND LAYER / OVERLAYS (Minecraft 1.8+ format) =====
  // These layers appear slightly above the base layer for clothing/sleeve effects

  // Right Arm Second Layer (Sleeve overlay)
  // Top (44,32 to 48,36)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.95);
  ctx.fillRect(44, 32, 4, 4);

  // Bottom (48,32 to 52,36)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.85);
  ctx.fillRect(48, 32, 4, 4);

  // Right side (40,36 to 44,48)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.9);
  ctx.fillRect(40, 36, 4, 12);
  // Add side details to overlay
  if (scheme.arms.detail) {
    ctx.fillStyle = darkenColor(scheme.arms.detail, 0.9);
    ctx.fillRect(40, 36, 4, 2);
  }

  // Front (44,36 to 48,48)
  ctx.fillStyle = scheme.arms.clothing;
  ctx.fillRect(44, 36, 4, 12);
  // Add front details to overlay
  if (scheme.arms.detail) {
    ctx.fillStyle = scheme.arms.detail;
    ctx.fillRect(44, 36, 4, 2);
    ctx.fillRect(45, 40, 2, 1);
  }

  // Left side (48,36 to 52,48)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.9);
  ctx.fillRect(48, 36, 4, 12);
  // Add side details to overlay
  if (scheme.arms.detail) {
    ctx.fillStyle = darkenColor(scheme.arms.detail, 0.9);
    ctx.fillRect(48, 36, 4, 2);
  }

  // Back (52,36 to 56,48)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.85);
  ctx.fillRect(52, 36, 4, 12);
  // Add back details to overlay
  if (scheme.arms.detail) {
    ctx.fillStyle = darkenColor(scheme.arms.detail, 0.85);
    ctx.fillRect(52, 36, 4, 2);
    ctx.fillRect(53, 40, 2, 1);
  }

  // Left Arm Second Layer (Sleeve overlay)
  // Top (52,48 to 56,52)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.95);
  ctx.fillRect(52, 48, 4, 4);

  // Bottom (56,48 to 60,52)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.85);
  ctx.fillRect(56, 48, 4, 4);

  // Right side (48,52 to 52,64)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.9);
  ctx.fillRect(48, 52, 4, 12);
  // Add side details to overlay
  if (scheme.arms.detail) {
    ctx.fillStyle = darkenColor(scheme.arms.detail, 0.9);
    ctx.fillRect(48, 52, 4, 2);
  }

  // Front (52,52 to 56,64)
  ctx.fillStyle = scheme.arms.clothing;
  ctx.fillRect(52, 52, 4, 12);
  // Add front details to overlay
  if (scheme.arms.detail) {
    ctx.fillStyle = scheme.arms.detail;
    ctx.fillRect(52, 52, 4, 2);
    ctx.fillRect(53, 56, 2, 1);
  }

  // Left side (56,52 to 60,64)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.9);
  ctx.fillRect(56, 52, 4, 12);
  // Add side details to overlay
  if (scheme.arms.detail) {
    ctx.fillStyle = darkenColor(scheme.arms.detail, 0.9);
    ctx.fillRect(56, 52, 4, 2);
  }

  // Back (60,52 to 64,64)
  ctx.fillStyle = darkenColor(scheme.arms.clothing, 0.85);
  ctx.fillRect(60, 52, 4, 12);
  // Add back details to overlay
  if (scheme.arms.detail) {
    ctx.fillStyle = darkenColor(scheme.arms.detail, 0.85);
    ctx.fillRect(60, 52, 4, 2);
    ctx.fillRect(61, 56, 2, 1);
  }

  // Right Leg Second Layer (Pants overlay)
  // Top (4,32 to 8,36)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.95);
  ctx.fillRect(4, 32, 4, 4);

  // Bottom (8,32 to 12,36)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.85);
  ctx.fillRect(8, 32, 4, 4);

  // Right side (0,36 to 4,48)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.9);
  ctx.fillRect(0, 36, 4, 12);
  // Add side details to overlay
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.9);
    ctx.fillRect(1, 36, 2, 12);
  }

  // Front (4,36 to 8,48)
  ctx.fillStyle = scheme.legs.primary;
  ctx.fillRect(4, 36, 4, 12);
  // Add front details to overlay
  if (scheme.legs.pockets) {
    ctx.fillStyle = scheme.legs.pockets;
    ctx.fillRect(5, 38, 2, 3);
  }

  // Left side (8,36 to 12,48)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.9);
  ctx.fillRect(8, 36, 4, 12);
  // Add side details to overlay
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.9);
    ctx.fillRect(9, 36, 2, 12);
  }

  // Back (12,36 to 16,48)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.85);
  ctx.fillRect(12, 36, 4, 12);
  // Add back details to overlay
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.85);
    ctx.fillRect(13, 36, 2, 12);
  }
  if (scheme.legs.pockets) {
    ctx.fillStyle = darkenColor(scheme.legs.pockets, 0.85);
    ctx.fillRect(13, 38, 2, 3);
  }

  // Left Leg Second Layer (Pants overlay)
  // Top (4,48 to 8,52)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.95);
  ctx.fillRect(4, 48, 4, 4);

  // Bottom (8,48 to 12,52)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.85);
  ctx.fillRect(8, 48, 4, 4);

  // Right side (0,52 to 4,64)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.9);
  ctx.fillRect(0, 52, 4, 12);
  // Add side details to overlay
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.9);
    ctx.fillRect(1, 52, 2, 12);
  }

  // Front (4,52 to 8,64)
  ctx.fillStyle = scheme.legs.primary;
  ctx.fillRect(4, 52, 4, 12);
  // Add front details to overlay
  if (scheme.legs.pockets) {
    ctx.fillStyle = scheme.legs.pockets;
    ctx.fillRect(5, 54, 2, 3);
  }

  // Left side (8,52 to 12,64)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.9);
  ctx.fillRect(8, 52, 4, 12);
  // Add side details to overlay
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.9);
    ctx.fillRect(9, 52, 2, 12);
  }

  // Back (12,52 to 16,64)
  ctx.fillStyle = darkenColor(scheme.legs.primary, 0.85);
  ctx.fillRect(12, 52, 4, 12);
  // Add back details to overlay
  if (scheme.legs.secondary) {
    ctx.fillStyle = darkenColor(scheme.legs.secondary, 0.85);
    ctx.fillRect(13, 52, 2, 12);
  }
  if (scheme.legs.pockets) {
    ctx.fillStyle = darkenColor(scheme.legs.pockets, 0.85);
    ctx.fillRect(13, 54, 2, 3);
  }

  // Add texture and details
  addPixelArtDetails(ctx, scheme);
}

/**
 * Add pixel art details and texture to make the skin more interesting
 * This function adds final touches to ALL surfaces (front, back, sides)
 */
function addPixelArtDetails(ctx: CanvasRenderingContext2D, scheme: SkinColorScheme): void {
  // Add subtle texture to clothing FRONT
  if (scheme.body.accent) {
    ctx.fillStyle = scheme.body.accent;
    // Random detail pixels for texture on front
    for (let i = 0; i < 20; i++) {
      const x = 20 + Math.floor(Math.random() * 8);
      const y = 21 + Math.floor(Math.random() * 10);
      if (Math.random() > 0.6) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Add texture to BACK as well
    const darkenedAccent = darkenColor(scheme.body.accent, 0.85);
    ctx.fillStyle = darkenedAccent;
    for (let i = 0; i < 15; i++) {
      const x = 32 + Math.floor(Math.random() * 8);
      const y = 21 + Math.floor(Math.random() * 10);
      if (Math.random() > 0.6) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Add texture to SIDES
    const sideDarkenedAccent = darkenColor(scheme.body.accent, 0.9);
    ctx.fillStyle = sideDarkenedAccent;
    for (let i = 0; i < 10; i++) {
      const x = 16 + Math.floor(Math.random() * 4);
      const y = 21 + Math.floor(Math.random() * 10);
      if (Math.random() > 0.6) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
    for (let i = 0; i < 10; i++) {
      const x = 28 + Math.floor(Math.random() * 4);
      const y = 21 + Math.floor(Math.random() * 10);
      if (Math.random() > 0.6) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // Add shading to legs
  if (scheme.legs.secondary) {
    ctx.fillStyle = scheme.legs.secondary;
    ctx.fillRect(4, 24, 4, 1);
    ctx.fillRect(20, 56, 4, 1);
    // Add vertical seam lines
    ctx.fillRect(5, 20, 1, 12);
    ctx.fillRect(21, 52, 1, 12);
  }

  // Add texture to arms
  if (scheme.arms.detail) {
    ctx.fillStyle = scheme.arms.detail;
    // Random texture pixels on arms
    for (let i = 0; i < 8; i++) {
      const x = 44 + Math.floor(Math.random() * 4);
      const y = 22 + Math.floor(Math.random() * 5);
      if (Math.random() > 0.5) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // Left arm
    for (let i = 0; i < 8; i++) {
      const x = 36 + Math.floor(Math.random() * 4);
      const y = 54 + Math.floor(Math.random() * 5);
      if (Math.random() > 0.5) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // Add facial freckles or skin details
  if (scheme.head.nose || scheme.head.blush) {
    const freckleColor = darkenColor(scheme.head.skin, 0.9);
    ctx.fillStyle = freckleColor;
    // Random freckles
    for (let i = 0; i < 3; i++) {
      const x = 9 + Math.floor(Math.random() * 7);
      const y = 11 + Math.floor(Math.random() * 3);
      if (Math.random() > 0.7) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // Add hair texture to ALL sides of head
  if (scheme.head.hairHighlight) {
    ctx.fillStyle = scheme.head.hairHighlight;
    // More natural hair strands on FRONT
    for (let i = 0; i < 12; i++) {
      const x = 40 + Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);
      if (Math.random() > 0.4) {
        ctx.fillRect(x, y, 1, 2); // Vertical strand
      }
    }

    // Hair strands on LEFT SIDE
    ctx.fillStyle = darkenColor(scheme.head.hairHighlight, 0.9);
    for (let i = 0; i < 8; i++) {
      const x = 48 + Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 6);
      if (Math.random() > 0.5) {
        ctx.fillRect(x, y, 1, 2);
      }
    }

    // Hair strands on RIGHT SIDE
    for (let i = 0; i < 8; i++) {
      const x = 32 + Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 6);
      if (Math.random() > 0.5) {
        ctx.fillRect(x, y, 1, 2);
      }
    }

    // Hair strands on BACK
    ctx.fillStyle = darkenColor(scheme.head.hairHighlight, 0.85);
    for (let i = 0; i < 10; i++) {
      const x = 56 + Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 6);
      if (Math.random() > 0.4) {
        ctx.fillRect(x, y, 1, 2);
      }
    }
  }

  // Backpack details
  if (scheme.accessories?.backpack) {
    ctx.fillStyle = scheme.accessories.backpack.color;
    // Draw backpack on back of torso (32,20 to 40,32)
    ctx.fillRect(33, 21, 6, 10);

    // Backpack straps
    if (scheme.accessories.backpack.straps) {
      ctx.fillStyle = scheme.accessories.backpack.straps;
      ctx.fillRect(21, 21, 1, 8); // Left strap
      ctx.fillRect(26, 21, 1, 8); // Right strap
    }
  }

  // Necklace/jewelry
  if (scheme.accessories?.necklace) {
    ctx.fillStyle = scheme.accessories.necklace.color;
    ctx.fillRect(21, 20, 6, 1); // Necklace around neck
    ctx.fillRect(23, 21, 2, 2); // Pendant
  }

  // Earrings
  if (scheme.accessories?.earrings) {
    ctx.fillStyle = scheme.accessories.earrings.color;
    ctx.fillRect(8, 11, 1, 1); // Left earring (right side of head)
    ctx.fillRect(16, 11, 1, 1); // Right earring (left side of head)
  }
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
  // ===== HEAD (8x8x8 pixels) =====

  // Head - Top (8,0 to 16,8)
  ctx.fillStyle = darkenColor(colors.skin, 0.95);
  ctx.fillRect(8, 0, 8, 8);

  // Head - Bottom (16,0 to 24,8)
  ctx.fillStyle = darkenColor(colors.skin, 0.85);
  ctx.fillRect(16, 0, 8, 8);

  // Head - Right side (0,8 to 8,16)
  ctx.fillStyle = darkenColor(colors.skin, 0.9);
  ctx.fillRect(0, 8, 8, 8);

  // Head - Front face (8,8 to 16,16)
  ctx.fillStyle = colors.skin;
  ctx.fillRect(8, 8, 8, 8);

  // Head - Left side (16,8 to 24,16)
  ctx.fillStyle = darkenColor(colors.skin, 0.9);
  ctx.fillRect(16, 8, 8, 8);

  // Head - Back (24,8 to 32,16)
  ctx.fillStyle = darkenColor(colors.skin, 0.85);
  ctx.fillRect(24, 8, 8, 8);

  // Eyes (on front face at 8,8-16,16)
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(10, 10, 2, 2); // Left eye
  ctx.fillRect(14, 10, 2, 2); // Right eye

  if (style.hasGlasses) {
    ctx.fillStyle = '#34495e';
    ctx.fillRect(9, 10, 3, 2);  // Left lens
    ctx.fillRect(14, 10, 3, 2); // Right lens
    ctx.fillRect(12, 10, 2, 1); // Bridge
  }

  // Mouth
  ctx.fillStyle = darkenColor(colors.skin, 0.8);
  ctx.fillRect(10, 13, 4, 1);
  ctx.fillRect(11, 14, 2, 1);

  // Beard
  if (style.hasBeard) {
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(9, 14, 6, 2);
    // Add to sides
    ctx.fillRect(1, 14, 6, 2);
    ctx.fillRect(17, 14, 6, 2);
  }

  // ===== HAIR/HAT LAYER (Second layer - overlay) =====
  // Hat layer - Top (40,0 to 48,8)
  ctx.fillStyle = colors.secondary;
  ctx.fillRect(40, 0, 8, 8);

  // Hat layer - Bottom (48,0 to 56,8)
  ctx.fillRect(48, 0, 8, 8);

  // Hat layer - Right (32,8 to 40,16)
  // Only draw hair on top part, leave face visible
  ctx.fillStyle = darkenColor(colors.secondary, 0.9);
  ctx.fillRect(32, 8, 8, 4);

  // Hat layer - Front (40,8 to 48,16)
  // Only draw hair on top part, leave face area (eyes/mouth) transparent
  ctx.fillStyle = colors.secondary;
  ctx.fillRect(40, 8, 8, 4); // Only top half (hair), not covering face

  // Hat layer - Left (48,8 to 56,16)
  // Only draw hair on top part
  ctx.fillStyle = darkenColor(colors.secondary, 0.9);
  ctx.fillRect(48, 8, 8, 4);

  // Hat layer - Back (56,8 to 64,16)
  // Only draw hair on top part
  ctx.fillStyle = darkenColor(colors.secondary, 0.85);
  ctx.fillRect(56, 8, 8, 4);

  // Hat accessory
  if (style.hasHat) {
    ctx.fillStyle = colors.accent;
    ctx.fillRect(40, 8, 8, 3); // Cap brim on front
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

  // ===== RIGHT ARM (4x12 pixels) =====
  // Top (44,16 to 48,20)
  ctx.fillStyle = darkenColor(colors.primary, 0.95);
  ctx.fillRect(44, 16, 4, 4);

  // Bottom (48,16 to 52,20)
  ctx.fillStyle = darkenColor(colors.primary, 0.85);
  ctx.fillRect(48, 16, 4, 4);

  // Right side (40,20 to 44,32)
  ctx.fillStyle = darkenColor(colors.primary, 0.9);
  ctx.fillRect(40, 20, 4, 12);

  // Front (44,20 to 48,32)
  ctx.fillStyle = colors.primary;
  ctx.fillRect(44, 20, 4, 12);

  // Left side (48,20 to 52,32)
  ctx.fillStyle = darkenColor(colors.primary, 0.9);
  ctx.fillRect(48, 20, 4, 12);

  // Back (52,20 to 56,32)
  ctx.fillStyle = darkenColor(colors.primary, 0.85);
  ctx.fillRect(52, 20, 4, 12);

  // Hand (skin color)
  ctx.fillStyle = colors.skin;
  ctx.fillRect(44, 28, 4, 4); // Front
  ctx.fillRect(40, 28, 4, 4); // Right side
  ctx.fillRect(48, 28, 4, 4); // Left side
  ctx.fillRect(52, 28, 4, 4); // Back

  // ===== LEFT ARM (4x12 pixels) =====
  // Top (36,48 to 40,52)
  ctx.fillStyle = darkenColor(colors.primary, 0.95);
  ctx.fillRect(36, 48, 4, 4);

  // Bottom (40,48 to 44,52)
  ctx.fillStyle = darkenColor(colors.primary, 0.85);
  ctx.fillRect(40, 48, 4, 4);

  // Right side (32,52 to 36,64)
  ctx.fillStyle = darkenColor(colors.primary, 0.9);
  ctx.fillRect(32, 52, 4, 12);

  // Front (36,52 to 40,64)
  ctx.fillStyle = colors.primary;
  ctx.fillRect(36, 52, 4, 12);

  // Left side (40,52 to 44,64)
  ctx.fillStyle = darkenColor(colors.primary, 0.9);
  ctx.fillRect(40, 52, 4, 12);

  // Back (44,52 to 48,64)
  ctx.fillStyle = darkenColor(colors.primary, 0.85);
  ctx.fillRect(44, 52, 4, 12);

  // Hand (skin color)
  ctx.fillStyle = colors.skin;
  ctx.fillRect(36, 60, 4, 4); // Front
  ctx.fillRect(32, 60, 4, 4); // Right side
  ctx.fillRect(40, 60, 4, 4); // Left side
  ctx.fillRect(44, 60, 4, 4); // Back

  // ===== RIGHT LEG (4x12 pixels) =====
  // Top (4,16 to 8,20)
  ctx.fillStyle = darkenColor(colors.secondary, 0.95);
  ctx.fillRect(4, 16, 4, 4);

  // Bottom (8,16 to 12,20)
  ctx.fillStyle = darkenColor(colors.secondary, 0.85);
  ctx.fillRect(8, 16, 4, 4);

  // Right side (0,20 to 4,32)
  ctx.fillStyle = darkenColor(colors.secondary, 0.9);
  ctx.fillRect(0, 20, 4, 12);

  // Front (4,20 to 8,32)
  ctx.fillStyle = colors.secondary;
  ctx.fillRect(4, 20, 4, 12);

  // Left side (8,20 to 12,32)
  ctx.fillStyle = darkenColor(colors.secondary, 0.9);
  ctx.fillRect(8, 20, 4, 12);

  // Back (12,20 to 16,32)
  ctx.fillStyle = darkenColor(colors.secondary, 0.85);
  ctx.fillRect(12, 20, 4, 12);

  // ===== LEFT LEG (4x12 pixels) =====
  // Top (20,48 to 24,52)
  ctx.fillStyle = darkenColor(colors.secondary, 0.95);
  ctx.fillRect(20, 48, 4, 4);

  // Bottom (24,48 to 28,52)
  ctx.fillStyle = darkenColor(colors.secondary, 0.85);
  ctx.fillRect(24, 48, 4, 4);

  // Right side (16,52 to 20,64)
  ctx.fillStyle = darkenColor(colors.secondary, 0.9);
  ctx.fillRect(16, 52, 4, 12);

  // Front (20,52 to 24,64)
  ctx.fillStyle = colors.secondary;
  ctx.fillRect(20, 52, 4, 12);

  // Left side (24,52 to 28,64)
  ctx.fillStyle = darkenColor(colors.secondary, 0.9);
  ctx.fillRect(24, 52, 4, 12);

  // Back (28,52 to 32,64)
  ctx.fillStyle = darkenColor(colors.secondary, 0.85);
  ctx.fillRect(28, 52, 4, 12);

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
 * Lighten a hex color by a factor (>1 for brighter)
 */
function lightenColor(color: string, factor: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.min(255, Math.floor(r * factor));
  const newG = Math.min(255, Math.floor(g * factor));
  const newB = Math.min(255, Math.floor(b * factor));

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
