export interface MinecraftSkin {
  id: string;
  name: string;
  imageData: string; // Base64 encoded PNG data
  createdAt: number;
  prompt?: string;
}

export interface SkinHistoryItem {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: number;
  prompt?: string;
}

export type SkinModel = 'default' | 'slim';

export interface EditorTool {
  type: 'pencil' | 'eraser' | 'fill' | 'eyedropper';
  color: string;
  size: number;
}
