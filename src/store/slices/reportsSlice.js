import { createSlice } from '@reduxjs/toolkit';
import { getPatientById } from '../../utils/hospitalStore';

const initialPatient = getPatientById('MX-1001');

const initialState = {
  items: initialPatient?.reports || [],
  filterCategory: 'All', // 'All' | 'Lab' | 'Cardiology' | 'Radiology' | 'Prescription'
  searchQuery: '',
  status: 'idle',
  error: null
};

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports: (state, action) => {
      state.items = action.payload;
    },
    loadPatientReports: (state, action) => {
      const patientId = action.payload;
      const patient = getPatientById(patientId);
      state.items = patient?.reports || [];
    },
    setCategoryFilter: (state, action) => {
      state.filterCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  }
});

export const {
  setReports,
  loadPatientReports,
  setCategoryFilter,
  setSearchQuery
} = reportsSlice.actions;

// Selectors
export const selectAllReports = (state) => state.reports.items;
export const selectReportsFilter = (state) => state.reports.filterCategory;

export const selectFilteredReports = (state) => {
  const { items, filterCategory, searchQuery } = state.reports;
  return items.filter((rep) => {
    const matchesCategory =
      filterCategory === 'All' ||
      rep.category === filterCategory ||
      rep.type === filterCategory;
    const matchesSearch =
      !searchQuery ||
      (rep.title && rep.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rep.doctor && rep.doctor.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
};

export default reportsSlice.reducer;
