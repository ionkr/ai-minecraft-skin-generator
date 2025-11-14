# Minecraft Skin UV Mapping Guide

This document explains the UV mapping and coordinate system for Minecraft 64x64 skins used in this project.

## Overview

Minecraft skins use a 64x64 pixel texture with specific UV mapping for each body part. The texture is divided into regions that map to different faces of 3D cuboid models.

## Coordinate System

- Origin (0,0) is at the **top-left** corner
- X-axis increases to the **right**
- Y-axis increases **downward**
- Format: `(x, y, width, height)`

## Layer System

Minecraft skins have **two layers**:

1. **Base Layer (First Layer)**: The actual skin/body
2. **Overlay Layer (Second Layer/Hat Layer)**: For hair, clothing overlays, accessories

**CRITICAL**: The overlay layer must NOT completely cover facial features. Leave face areas (eyes, mouth) transparent or partially covered.

---

## Head (8x8x8 pixels)

### Base Layer

| Face | Coordinates | Usage |
|------|-------------|-------|
| Top | (8, 0) to (16, 8) | Top of head - slightly darker skin |
| Bottom | (16, 0) to (24, 8) | Bottom of head - darker skin |
| Right | (0, 8) to (8, 16) | Right side - medium dark skin |
| **Front** | **(8, 8) to (16, 16)** | **FACE - skin + eyes + mouth** |
| Left | (16, 8) to (24, 16) | Left side - medium dark skin |
| Back | (24, 8) to (32, 16) | Back of head - darker skin |

### Facial Features (on Front face)

- **Eyes**:
  - Left eye: (10, 10, 2, 2)
  - Right eye: (14, 10, 2, 2)
- **Mouth**:
  - Upper: (10, 13, 4, 1)
  - Lower: (11, 14, 2, 1)
- **Beard** (optional): (9, 14, 6, 2)
- **Glasses** (optional):
  - Left lens: (9, 10, 3, 2)
  - Right lens: (14, 10, 3, 2)
  - Bridge: (12, 10, 2, 1)

### Overlay Layer (Hair/Hat)

| Face | Coordinates | **IMPORTANT** |
|------|-------------|---------------|
| Top | (40, 0) to (48, 8) | Full coverage OK |
| Bottom | (48, 0) to (56, 8) | Full coverage OK |
| Right | (32, 8) to (40, 16) | **Height 4 only** (32, 8, 8, 4) |
| **Front** | **(40, 8) to (48, 16)** | **Height 4 only** (40, 8, 8, 4) |
| Left | (48, 8) to (56, 16) | **Height 4 only** (48, 8, 8, 4) |
| Back | (56, 8) to (64, 16) | **Height 4 only** (56, 8, 8, 4) |

**⚠️ WARNING**: If you draw the full 8px height on overlay sides (Right/Front/Left/Back), it will completely cover the face underneath, making eyes and mouth invisible in 3D rendering!

**✅ SOLUTION**: Only draw the top 4 pixels (hair area), leaving the bottom 4 pixels transparent for face visibility.

---

## Body/Torso (8x12x4 pixels)

| Face | Coordinates | Notes |
|------|-------------|-------|
| Top | (20, 16, 8, 4) | Top of torso |
| Bottom | (28, 16, 8, 4) | Bottom of torso |
| Right | (16, 20, 4, 12) | Right side |
| Front | (20, 20, 8, 12) | Front - main clothing |
| Left | (28, 20, 4, 12) | Left side |
| Back | (32, 20, 8, 12) | Back |

### Clothing Details (on Front)

- Collar: (20, 20, 8, 1)
- Buttons/Zipper: (23, 21, 2, 8)
- Belt: (20, 28, 8, 1)

---

## Right Arm (4x12x4 pixels)

| Face | Coordinates |
|------|-------------|
| Top | (44, 16, 4, 4) |
| Bottom | (48, 16, 4, 4) |
| Right | (40, 20, 4, 12) |
| Front | (44, 20, 4, 12) |
| Left | (48, 20, 4, 12) |
| Back | (52, 20, 4, 12) |

**Hand** (skin color): (44, 28, 4, 4)

---

## Left Arm (4x12x4 pixels)

| Face | Coordinates |
|------|-------------|
| Top | (36, 48, 4, 4) |
| Bottom | (40, 48, 4, 4) |
| Right | (32, 52, 4, 12) |
| Front | (36, 52, 4, 12) |
| Left | (40, 52, 4, 12) |
| Back | (44, 52, 4, 12) |

**Hand** (skin color): (36, 60, 4, 4)

---

## Right Leg (4x12x4 pixels)

| Face | Coordinates |
|------|-------------|
| Top | (4, 16, 4, 4) |
| Bottom | (8, 16, 4, 4) |
| Right | (0, 20, 4, 12) |
| Front | (4, 20, 4, 12) |
| Left | (8, 20, 4, 12) |
| Back | (12, 20, 4, 12) |

**Shoe** (optional): (4, 28, 4, 4)

---

## Left Leg (4x12x4 pixels)

| Face | Coordinates |
|------|-------------|
| Top | (20, 48, 4, 4) |
| Bottom | (24, 48, 4, 4) |
| Right | (16, 52, 4, 12) |
| Front | (20, 52, 4, 12) |
| Left | (24, 52, 4, 12) |
| Back | (28, 52, 4, 12) |

**Shoe** (optional): (20, 60, 4, 4)

---

## Best Practices

### 1. Shading
Apply shading to create depth:
- Top faces: 95% of base color (slightly darker)
- Bottom faces: 85% of base color (darker)
- Side faces: 90% of base color
- Front faces: 100% of base color (full brightness)

### 2. Overlay Layer Guidelines
- **DO**: Use overlay for hair, hats, clothing details, glasses
- **DO**: Keep overlay partially transparent or partial coverage
- **DON'T**: Cover facial features completely
- **DON'T**: Draw full height on overlay sides if it blocks the face

### 3. Testing
Always test in 3D viewer to ensure:
- Face is visible from all angles
- Eyes and mouth are not covered
- Body parts are correctly positioned
- Colors and shading look natural

### 4. Pixel Art Tips
- Use solid colors for clean pixel art style
- Add subtle texture with random detail pixels
- Keep designs simple due to low resolution
- Test at actual size (64x64) to see real appearance

---

## Common Issues

### Issue: Face not visible in 3D preview

**Cause**: Overlay layer (hair/hat) is covering the face completely

**Solution**:
- Change overlay side heights from 8px to 4px
- Only draw hair on top portion (y=8 to y=12)
- Leave face area (y=12 to y=16) transparent

**Example**:
```typescript
// ❌ WRONG - Covers face completely
ctx.fillRect(40, 8, 8, 8); // Hat layer front

// ✅ CORRECT - Only covers hair area
ctx.fillRect(40, 8, 8, 4); // Hat layer front - top only
```

### Issue: Body parts not aligned

**Cause**: Incorrect UV coordinates

**Solution**:
- Verify coordinates against this document
- Ensure (x, y, width, height) format is correct
- Check that Y-axis increases downward

### Issue: Colors look wrong

**Cause**: Missing or incorrect shading

**Solution**:
- Apply darken factors to different faces
- Use consistent shading across all body parts

---

## Implementation Notes

This project uses two skin generation functions:

1. **`drawDetailedSkin()`**: For AI-generated skins with color schemes
2. **`drawSkinTemplate()`**: For demo/procedural skins

Both functions MUST follow the same UV mapping rules documented here.

## References

- [Minecraft Wiki - Player Skin](https://minecraft.fandom.com/wiki/Player.png)
- [skinview3d Library](https://github.com/bs-community/skinview3d)
- Standard Minecraft 64x64 skin format (v1.8+)

---

**Last Updated**: 2025-11-14
**Project**: AI Minecraft Skin Generator
**File**: `src/utils/skinGenerator.ts`
