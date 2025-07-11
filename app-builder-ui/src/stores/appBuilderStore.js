import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useAppBuilderStore = create(
  persist(
    (set, get) => ({
      // Current workflow state
      currentWorkflow: null,
      workflowStage: null,
      workflowData: {},

      // Generated apps history
      generatedApps: [],
      currentApp: null,

      // Templates
      templates: [],
      customTemplates: [],
      favoriteTemplates: [],

      // User preferences
      preferences: {
        theme: 'light',
        autoSave: true,
        showHints: true,
      },

      // Actions - Workflow
      setWorkflow: (workflow) => set({ currentWorkflow: workflow }),
      setWorkflowStage: (stage) => set({ workflowStage: stage }),
      updateWorkflowData: (data) => set(state => ({
        workflowData: { ...state.workflowData, ...data }
      })),
      resetWorkflow: () => set({
        currentWorkflow: null,
        workflowStage: null,
        workflowData: {}
      }),

      // Actions - Generated Apps
      addGeneratedApp: (app) => {
        const newApp = {
          id: uuidv4(),
          ...app,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set(state => ({
          generatedApps: [newApp, ...state.generatedApps],
          currentApp: newApp
        }));
        
        return newApp;
      },

      updateGeneratedApp: (id, updates) => set(state => ({
        generatedApps: state.generatedApps.map(app =>
          app.id === id 
            ? { ...app, ...updates, updatedAt: new Date().toISOString() }
            : app
        )
      })),

      deleteGeneratedApp: (id) => set(state => ({
        generatedApps: state.generatedApps.filter(app => app.id !== id),
        currentApp: state.currentApp?.id === id ? null : state.currentApp
      })),

      setCurrentApp: (app) => set({ currentApp: app }),

      // Actions - Templates
      addTemplate: (template) => set(state => ({
        templates: [...state.templates, { ...template, id: uuidv4() }]
      })),

      addCustomTemplate: (template) => set(state => ({
        customTemplates: [...state.customTemplates, { 
          ...template, 
          id: uuidv4(),
          isCustom: true,
          createdAt: new Date().toISOString()
        }]
      })),

      toggleFavoriteTemplate: (templateId) => set(state => ({
        favoriteTemplates: state.favoriteTemplates.includes(templateId)
          ? state.favoriteTemplates.filter(id => id !== templateId)
          : [...state.favoriteTemplates, templateId]
      })),

      // Actions - Preferences
      updatePreferences: (prefs) => set(state => ({
        preferences: { ...state.preferences, ...prefs }
      })),

      // Computed values
      getAppById: (id) => get().generatedApps.find(app => app.id === id),
      
      getAppsByIndustry: (industry) => 
        get().generatedApps.filter(app => app.industry === industry),
      
      getRecentApps: (limit = 5) => 
        get().generatedApps.slice(0, limit),
      
      getAllTemplates: () => [
        ...get().templates,
        ...get().customTemplates
      ],

      // Workflow helpers
      saveWorkflowState: () => {
        const state = get();
        return {
          workflow: state.currentWorkflow,
          stage: state.workflowStage,
          data: state.workflowData
        };
      },

      restoreWorkflowState: (savedState) => {
        if (savedState) {
          set({
            currentWorkflow: savedState.workflow,
            workflowStage: savedState.stage,
            workflowData: savedState.data
          });
        }
      },

      // Export/Import functionality
      exportApp: (appId) => {
        const app = get().getAppById(appId);
        if (app) {
          const blob = new Blob([JSON.stringify(app, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${app.name || 'app'}-${app.id}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      },

      importApp: async (file) => {
        try {
          const text = await file.text();
          const app = JSON.parse(text);
          delete app.id; // Remove old ID
          get().addGeneratedApp(app);
          return true;
        } catch (error) {
          console.error('Failed to import app:', error);
          return false;
        }
      }
    }),
    {
      name: 'app-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        generatedApps: state.generatedApps,
        customTemplates: state.customTemplates,
        favoriteTemplates: state.favoriteTemplates,
        preferences: state.preferences
      })
    }
  )
);

export default useAppBuilderStore;
