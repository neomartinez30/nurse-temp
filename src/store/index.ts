// filepath: src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import callReducer from './slices/callSlice';
import databaseReducer from './slices/databaseSlice';

const store = configureStore({
  reducer: {
    call: callReducer,
    database: databaseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;