const CHAT_SESSION_KEY = 'agri_shield_chat_history';

export const chatCacheService = {
  // Load messages from local session storage
  getStoredMessages() {
    try {
      const stored = sessionStorage.getItem(CHAT_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading chat history from cache:', error);
      return null;
    }
  },

  // Save updated message list to session storage
  saveMessages(messages) {
    try {
      sessionStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history to cache:', error);
    }
  },

  // Clear chat memory for a fresh session
  clearHistory() {
    sessionStorage.removeItem(CHAT_SESSION_KEY);
  }
};