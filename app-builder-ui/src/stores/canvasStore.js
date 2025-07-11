import create from 'zustand';

const useCanvasStore = create((set) => ({
  canvasVisible: false,
  toggleCanvas: () => set((state) => ({ canvasVisible: !state.canvasVisible })),
  setCanvasVisible: (visible) => set({ canvasVisible: visible }),
}));

export default useCanvasStore;
