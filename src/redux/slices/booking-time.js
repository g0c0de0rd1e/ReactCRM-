import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerBookingTable from '../../services/seller/booking-time';
import adminBookingTable from '../../services/booking-time';

const initialState = {
  loading: false,
  data: null,
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
};

export const adminFetchBookingTime = createAsyncThunk(
  'booking/adminFetchBookingTime',
  (params = {}) => {
    return adminBookingTable
      .getAll({ ...initialState.params })
      .then((res) => res);
  }
);
export const fetchBookingTime = createAsyncThunk(
  'booking/fetchBookingTime',
  (params = {}) => {
    return sellerBookingTable
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const bookingTimeSlice = createSlice({
  name: 'bookingTime',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(adminFetchBookingTime.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(adminFetchBookingTime.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.data = payload.data;
      state.error = '';
    });
    builder.addCase(adminFetchBookingTime.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(fetchBookingTime.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookingTime.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.data = payload.data ? [payload.data] : [];
      state.error = '';
    });
    builder.addCase(fetchBookingTime.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default bookingTimeSlice.reducer;
