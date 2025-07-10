import create from 'zustand';

// Modes: 'welcome', 'chat', 'chat+canvas'
const useChatViewStore = create((set) => ({
  viewMode: 'welcome',
  setViewMode: (mode) => set({ viewMode: mode }),
}));

export default useChatViewStore;
