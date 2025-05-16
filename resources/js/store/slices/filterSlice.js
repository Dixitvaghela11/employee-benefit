import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employeeMaster: {
    employee_code: '',
    full_name: '',
    department: '',
    status: '',
    category: '',
    page: 1,
  },
  candidateMaster: {
    application_date_from: '',
    application_date_to: '',
    full_name: '',
    contact_number: '',
    department_id: '',
    position_applied: '',
    interview_status: '',
    final_status: '',
    page: 1,
  },
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setEmployeeFilters: (state, action) => {
      state.employeeMaster = action.payload;
    },
    setCandidateFilters: (state, action) => {
      state.candidateMaster = action.payload;
    },
    resetEmployeeFilters: (state) => {
      state.employeeMaster = initialState.employeeMaster;
    },
    resetCandidateFilters: (state) => {
      state.candidateMaster = initialState.candidateMaster;
    },
  },
});

export const {
  setEmployeeFilters,
  setCandidateFilters,
  resetEmployeeFilters,
  resetCandidateFilters,
} = filterSlice.actions;

export default filterSlice.reducer; 