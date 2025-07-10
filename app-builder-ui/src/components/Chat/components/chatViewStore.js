import create from 'zustand';

// Enhanced chat view store with dynamic switching intelligence
const useChatViewStore = create((set, get) => ({
  viewMode: 'welcome', // 'welcome' | 'chat' | 'chat+canvas'
  userPreference: null, // User's preferred mode
  lastActivity: null, // Track last activity type
  dynamicSwitchingEnabled: true, // Allow automatic switching
  
  setViewMode: (mode, isUserAction = false) => {
    set({ 
      viewMode: mode,
      // Remember user preference when manually switched
      userPreference: isUserAction ? mode : get().userPreference,
      lastActivity: isUserAction ? 'manual' : 'auto'
    });
  },
  
  setDynamicSwitching: (enabled) => set({ dynamicSwitchingEnabled: enabled }),
  
  // Smart switching with user preference consideration
  smartSwitch: (suggestedMode, context = '') => {
    const state = get();
    
    // Don't auto-switch if user has strong preference
    if (!state.dynamicSwitchingEnabled) return;
    
    // If user manually set a mode recently, respect it
    if (state.lastActivity === 'manual' && state.userPreference) {
      // Only override manual preference for strong signals
      const strongSignals = ['generation_started', 'output_ready', 'error_occurred'];
      if (!strongSignals.includes(context)) return;
    }
    
    set({ 
      viewMode: suggestedMode,
      lastActivity: 'auto'
    });
  },
  
  // Reset to initial state
  reset: () => set({
    viewMode: 'welcome',
    userPreference: null,
    lastActivity: null,
    dynamicSwitchingEnabled: true
  })
}));

export default useChatViewStore;
