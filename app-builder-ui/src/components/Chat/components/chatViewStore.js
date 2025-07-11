import create from 'zustand';

// Simplified chat view store 
const useChatViewStore = create((set) => ({
  viewMode: 'welcome', // 'welcome' | 'chat' | 'chat+canvas'
  
  setViewMode: (mode) => {
    set({ viewMode: mode });
  },
  
  // Reset to initial state
  reset: () => set({
    viewMode: 'welcome'
  })
}));

export default useChatViewStore;
