import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerBookingTable from 'services/seller/booking-table';

const initialState = {
  loading: false,
  statistics: {},
  error: '',
};

export const fetchBookingStatistics = createAsyncThunk(
  'booking/statistics',
  (params = {}) => {
    return sellerBookingTable
      .getStatistics({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const bookingStatisticSlice = createSlice({
  name: 'bookingStatistics',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBookingStatistics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookingStatistics.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.statistics = payload.data;
      state.error = '';
    });
    builder.addCase(fetchBookingStatistics.rejected, (state, action) => {
      state.loading = false;
      state.statistics = {};
      state.error = action.error.message;
    });
  },
});

export default bookingStatisticSlice.reducer;
