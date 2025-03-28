// filepath: src/store/slices/callSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallState } from './types';

const initialState: CallState = {
    isCallActive: false,
    callerId: null,
    stateOfCall: null,
    interactionID: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    startCall(state, action: PayloadAction<string>) {
      state.isCallActive = true;
      state.callerId = action.payload;
      state.stateOfCall = action.payload;
      state.interactionID = action.payload;
    },
    endCall(state) {
      state.isCallActive = false;
      state.callerId = null;
      state.stateOfCall = null;
      state.interactionID = null;
    },
    updateCallState(state, action: PayloadAction<Partial<CallState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { startCall, endCall, updateCallState } = callSlice.actions;
export default callSlice.reducer;