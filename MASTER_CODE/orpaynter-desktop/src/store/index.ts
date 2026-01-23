import { create } from 'zustand'

interface AppState {
  // User state
  user: {
    name: string | null;
    email: string | null;
    licenseType: 'basic' | 'professional' | 'enterprise' | null;
    isAuthenticated: boolean;
  };
  // Assessment state
  assessment: {
    images: string[];
    results: {
      damageDetected: boolean;
      damageType: string | null;
      damageLocation: string | null;
      assessmentAccuracy: number;
      urgency: 'low' | 'medium' | 'high' | 'critical';
      estimatedCost: {
        min: number;
        max: number;
      };
      recommendations: string[];
    } | null;
    isProcessing: boolean;
  };
  // Lead qualification state
  leadQualification: {
    currentLead: {
      name: string | null;
      email: string | null;
      phone: string | null;
      budget: string | null;
      authority: string | null;
      need: string | null;
      timeline: string | null;
      score: number | null;
    };
    leads: any[];
  };
  // Actions
  setUser: (user: Partial<AppState['user']>) => void;
  addAssessmentImage: (image: string) => void;
  clearAssessmentImages: () => void;
  setAssessmentResults: (results: AppState['assessment']['results']) => void;
  setAssessmentProcessing: (isProcessing: boolean) => void;
  updateCurrentLead: (lead: Partial<AppState['leadQualification']['currentLead']>) => void;
  saveLead: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial user state
  user: {
    name: null,
    email: null,
    licenseType: null,
    isAuthenticated: false,
  },
  // Initial assessment state
  assessment: {
    images: [],
    results: null,
    isProcessing: false,
  },
  // Initial lead qualification state
  leadQualification: {
    currentLead: {
      name: null,
      email: null,
      phone: null,
      budget: null,
      authority: null,
      need: null,
      timeline: null,
      score: null,
    },
    leads: [],
  },
  // Actions
  setUser: (userData) => set((state) => ({
    user: {
      ...state.user,
      ...userData,
    },
  })),
  addAssessmentImage: (image) => set((state) => ({
    assessment: {
      ...state.assessment,
      images: [...state.assessment.images, image],
    },
  })),
  clearAssessmentImages: () => set((state) => ({
    assessment: {
      ...state.assessment,
      images: [],
      results: null,
    },
  })),
  setAssessmentResults: (results) => set((state) => ({
    assessment: {
      ...state.assessment,
      results,
      isProcessing: false,
    },
  })),
  setAssessmentProcessing: (isProcessing) => set((state) => ({
    assessment: {
      ...state.assessment,
      isProcessing,
    },
  })),
  updateCurrentLead: (leadData) => set((state) => ({
    leadQualification: {
      ...state.leadQualification,
      currentLead: {
        ...state.leadQualification.currentLead,
        ...leadData,
      },
    },
  })),
  saveLead: () => set((state) => {
    // Calculate score based on BANT criteria (simplified version)
    const currentLead = state.leadQualification.currentLead;
    let score = 0;
    
    if (currentLead.budget) score += 25;
    if (currentLead.authority) score += 25;
    if (currentLead.need) score += 25;
    if (currentLead.timeline) score += 25;
    
    const updatedLead = {
      ...currentLead,
      score,
      id: Date.now().toString(), // Simple unique ID
    };
    
    return {
      leadQualification: {
        currentLead: {
          name: null,
          email: null,
          phone: null,
          budget: null,
          authority: null,
          need: null,
          timeline: null,
          score: null,
        },
        leads: [...state.leadQualification.leads, updatedLead],
      },
    };
  }),
}))
