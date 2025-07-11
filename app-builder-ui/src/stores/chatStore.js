import create from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  inputValue: '',
  isLoading: false,
  isConnected: false,
  sidebarCollapsed: false,
  activeTab: 'chat',
  showWelcome: true,
  isDarkMode: (() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })(),

  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setInputValue: (inputValue) => set({ inputValue }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setShowWelcome: (showWelcome) => set({ showWelcome }),
  setIsDarkMode: (isDarkMode) => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    set({ isDarkMode });
  },
}));

export default useChatStore;
