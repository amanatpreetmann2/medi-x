import { configureStore } from '@reduxjs/toolkit';
import appointmentsReducer from './slices/appointmentsSlice';
import medicationsReducer from './slices/medicationsSlice';
import reportsReducer from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    medications: medicationsReducer,
    reports: reportsReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
