import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AnalyticsState {
  ga4Obj: Record<string, any>;
  updateGAEvents: Record<string, any>;
  updateCSEvents: Record<string, any>;
  grxMapping: Record<string, any>;
  customDimension: Record<string, any>;
  planPageExperiment: string | null;
}

const initialState: AnalyticsState = {
  ga4Obj: {},
  updateGAEvents: {},
  updateCSEvents: {},
  grxMapping: {},
  customDimension: {},
  planPageExperiment: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateGA4Obj: (state, action: PayloadAction<Record<string, any>>) => {
      state.ga4Obj = { ...state.ga4Obj, ...action.payload };
    },
    updateGAEvents: (state, action: PayloadAction<Record<string, any>>) => {
      state.updateGAEvents = { ...state.updateGAEvents, ...action.payload };
    },
    updateCSEvents: (state, action: PayloadAction<Record<string, any>>) => {
      state.updateCSEvents = { ...state.updateCSEvents, ...action.payload };
    },
    setGrxMapping: (state, action: PayloadAction<Record<string, any>>) => {
      state.grxMapping = action.payload;
    },
    setCustomDimension: (state, action: PayloadAction<Record<string, any>>) => {
      state.customDimension = { ...state.customDimension, ...action.payload };
    },
    setPlanPageExperiment: (state, action: PayloadAction<string | null>) => {
      state.planPageExperiment = action.payload;
    },
    clearAnalytics: (state) => {
      state.ga4Obj = {};
      state.updateGAEvents = {};
      state.updateCSEvents = {};
      state.customDimension = {};
      state.planPageExperiment = null;
    },
  },
});

export const {
  updateGA4Obj,
  updateGAEvents,
  updateCSEvents,
  setGrxMapping,
  setCustomDimension,
  setPlanPageExperiment,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

