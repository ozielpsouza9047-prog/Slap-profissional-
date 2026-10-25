/**
 * Studio Royale - Local Storage Persistence Service
 * Safely handles reading, writing, and fallback parsing for client-side data persistence.
 */

export const STORAGE_KEYS = {
  CLIENTS: 'STUDIO_ROYALE_CLIENTS_V1',
  APPOINTMENTS: 'STUDIO_ROYALE_APPOINTMENTS_V1',
  SERVICES: 'STUDIO_ROYALE_SERVICES_V1',
  PRODUCTS: 'STUDIO_ROYALE_PRODUCTS_V1',
  CART: 'STUDIO_ROYALE_CART_V1',
  ORDERS: 'STUDIO_ROYALE_ORDERS_V1',
  SETTINGS: 'STUDIO_ROYALE_SETTINGS_V1'
};

export const storageService = {
  /**
   * Safely load items from localStorage with JSON parsing and fallback.
   */
  loadFromStorage<T>(key: string, fallbackValue: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return fallbackValue;
      }
      const rawItem = window.localStorage.getItem(key);
      if (!rawItem) {
        return fallbackValue;
      }
      const parsed = JSON.parse(rawItem);
      return parsed !== null && parsed !== undefined ? (parsed as T) : fallbackValue;
    } catch (error) {
      console.warn(`[StudioRoyale Storage] Erro ao carregar a chave "${key}". Usando valor padrão.`, error);
      return fallbackValue;
    }
  },

  /**
   * Safely write items to localStorage with error handling.
   */
  saveToStorage<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`[StudioRoyale Storage] Falha ao salvar a chave "${key}" no localStorage.`, error);
      return false;
    }
  },

  /**
   * Clear all Studio Royale storage keys to restore factory defaults.
   */
  clearAllStorage(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      Object.values(STORAGE_KEYS).forEach((key) => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('[StudioRoyale Storage] Falha ao limpar o localStorage.', error);
    }
  }
};
