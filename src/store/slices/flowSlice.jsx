import { createSlice } from '@reduxjs/toolkit';

const initialState = { currentStep: 1 };

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    nextStep: (state) => { if (state.currentStep < 4) state.currentStep += 1; },
    prevStep: (state) => { if (state.currentStep > 1) state.currentStep -= 1; },
    goToStep: (state, action) => {
      const s = Number(action.payload);
      if (s >= 1 && s <= 4) state.currentStep = s;
    },
    resetFlow: () => initialState,
  },
});

export const { nextStep, prevStep, goToStep, resetFlow } = flowSlice.actions;
export default flowSlice.reducer;
