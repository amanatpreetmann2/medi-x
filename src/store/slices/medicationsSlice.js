import { createSlice } from '@reduxjs/toolkit';
import {
  getPatientById,
  toggleMedicationDose as toggleInStore,
  addMedication as addInStore
} from '../../utils/hospitalStore';

const initialPatient = getPatientById('MX-1001');

const initialState = {
  items: initialPatient?.medications || [],
  filterPeriod: 'All', // 'All' | 'Morning' | 'Noon' | 'Evening' | 'Night'
  status: 'idle',
  error: null
};

export const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    setMedications: (state, action) => {
      state.items = action.payload;
    },
    loadPatientMedications: (state, action) => {
      const patientId = action.payload;
      const patient = getPatientById(patientId);
      state.items = patient?.medications || [];
    },
    toggleDose: (state, action) => {
      const { patientId, medId } = action.payload;
      const existing = state.items.find((m) => m.id === medId);
      if (existing) {
        const nextState = !existing.taken;
        existing.taken = nextState;
        if (patientId) {
          toggleInStore(patientId, medId, nextState);
        }
      }
    },
    addMedicationItem: (state, action) => {
      const { patientId, medicationData } = action.payload;
      if (patientId) {
        const persisted = addInStore(patientId, medicationData);
        if (persisted) {
          state.items.unshift(persisted);
          return;
        }
      }
      const newMed = {
        id: `med_${Date.now()}`,
        taken: false,
        ...medicationData
      };
      state.items.unshift(newMed);
    },
    setFilterPeriod: (state, action) => {
      state.filterPeriod = action.payload;
    }
  }
});

export const {
  setMedications,
  loadPatientMedications,
  toggleDose,
  addMedicationItem,
  setFilterPeriod
} = medicationsSlice.actions;

// Selectors
export const selectAllMedications = (state) => state.medications.items;
export const selectFilterPeriod = (state) => state.medications.filterPeriod;

export const selectFilteredMedications = (state) => {
  const period = state.medications.filterPeriod;
  if (period === 'All') return state.medications.items;
  return state.medications.items.filter((m) => m.period === period);
};

export const selectMedicationAdherence = (state) => {
  const items = state.medications.items;
  if (!items.length) return 0;
  const takenCount = items.filter((m) => m.taken).length;
  return Math.round((takenCount / items.length) * 100);
};

export default medicationsSlice.reducer;
