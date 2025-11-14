import type { MinecraftSkin, SkinHistoryItem } from '../types/skin';

const STORAGE_KEY = 'minecraft_skin_history';
const MAX_HISTORY_ITEMS = 50;

export const skinStorage = {
  // Save a skin to local storage
  saveSkin(skin: MinecraftSkin): void {
    const history = this.getHistory();
    const newHistory = [skin, ...history.filter(s => s.id !== skin.id)];

    // Limit history size
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory.splice(MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  },

  // Get all skins from history
  getHistory(): MinecraftSkin[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load skin history:', error);
      return [];
    }
  },

  // Get a specific skin by ID
  getSkinById(id: string): MinecraftSkin | null {
    const history = this.getHistory();
    return history.find(skin => skin.id === id) || null;
  },

  // Delete a skin from history
  deleteSkin(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(skin => skin.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Clear all history
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get history items (lighter weight for UI)
  getHistoryItems(): SkinHistoryItem[] {
    const history = this.getHistory();
    return history.map(skin => ({
      id: skin.id,
      name: skin.name,
      thumbnail: skin.imageData,
      createdAt: skin.createdAt,
      prompt: skin.prompt,
    }));
  },
};
