import { createSlice } from '@reduxjs/toolkit';
import {
  getPatientById,
  getActivePatientId,
  bookAppointment as bookInStore,
  rescheduleAppointment as rescheduleInStore,
  cancelAppointment as cancelInStore
} from '../../utils/hospitalStore';

const activePatientId = getActivePatientId();
const initialPatient = getPatientById(activePatientId);

const initialState = {
  items: initialPatient?.appointments || [],
  filter: 'All', // 'All' | 'Upcoming' | 'Past' | 'Cancelled'
  status: 'idle',
  error: null
};

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.items = action.payload;
    },
    loadPatientAppointments: (state, action) => {
      const patientId = action.payload || getActivePatientId();
      const patient = getPatientById(patientId);
      state.items = patient?.appointments || [];
    },
    addAppointment: (state, action) => {
      const { patientId, appointmentData } = action.payload;
      const targetPatientId = patientId || getActivePatientId();
      // Persist to underlying hospital store if patientId provided
      if (targetPatientId) {
        const persisted = bookInStore(targetPatientId, appointmentData);
        if (persisted) {
          state.items.unshift(persisted);
          return;
        }
      }
      const newAppt = {
        id: `appt_${Date.now()}`,
        status: 'Upcoming',
        ...appointmentData
      };
      state.items.unshift(newAppt);
    },
    rescheduleAppointment: (state, action) => {
      const { patientId, appointmentId, newDate, newTime } = action.payload;
      const targetPatientId = patientId || getActivePatientId();
      if (targetPatientId) {
        rescheduleInStore(targetPatientId, appointmentId, newDate, newTime);
      }
      const existing = state.items.find((a) => a.id === appointmentId);
      if (existing) {
        existing.date = newDate;
        existing.time = newTime;
        existing.status = 'Upcoming';
      }
    },
    cancelAppointment: (state, action) => {
      const { patientId, appointmentId } = action.payload;
      const targetPatientId = patientId || getActivePatientId();
      if (targetPatientId) {
        cancelInStore(targetPatientId, appointmentId);
      }
      const existing = state.items.find((a) => a.id === appointmentId);
      if (existing) {
        existing.status = 'Cancelled';
      }
    },
    setAppointmentFilter: (state, action) => {
      state.filter = action.payload;
    }
  }
});

export const {
  setAppointments,
  loadPatientAppointments,
  addAppointment,
  rescheduleAppointment,
  cancelAppointment,
  setAppointmentFilter
} = appointmentsSlice.actions;

// Selectors
export const selectAllAppointments = (state) => state.appointments.items;
export const selectAppointmentFilter = (state) => state.appointments.filter;

export const selectUpcomingAppointments = (state) =>
  state.appointments.items.filter((a) => a.status === 'Upcoming');

export const selectPastAppointments = (state) =>
  state.appointments.items.filter((a) => a.status === 'Completed' || a.status === 'Past');

export const selectCancelledAppointments = (state) =>
  state.appointments.items.filter((a) => a.status === 'Cancelled');

export const selectFilteredAppointments = (state) => {
  const filter = state.appointments.filter;
  if (filter === 'Upcoming') return state.appointments.items.filter((a) => a.status === 'Upcoming');
  if (filter === 'Past') return state.appointments.items.filter((a) => a.status === 'Completed' || a.status === 'Past');
  if (filter === 'Cancelled') return state.appointments.items.filter((a) => a.status === 'Cancelled');
  return state.appointments.items;
};

export const selectAppointmentStats = (state) => {
  const items = state.appointments.items;
  return {
    total: items.length,
    upcoming: items.filter((a) => a.status === 'Upcoming').length,
    completed: items.filter((a) => a.status === 'Completed' || a.status === 'Past').length,
    cancelled: items.filter((a) => a.status === 'Cancelled').length
  };
};

export default appointmentsSlice.reducer;
