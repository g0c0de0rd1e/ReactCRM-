import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerBookingZone from '../../services/seller/booking-zone';
import bookingZone from '../../services/booking-zone';

const initialState = {
  loading: false,
  zone: [],
  current_zone: null,
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchAdminBookingZone = createAsyncThunk(
  'bookingZone/fetchAdminBookingZone',
  (params = {}) => {
    return bookingZone
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchBookingZone = createAsyncThunk(
  'bookingZone/fetchBookingZone',
  (params = {}) => {
    return sellerBookingZone
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const bookingZoneSlice = createSlice({
  name: 'bookingZone',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAdminBookingZone.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAdminBookingZone.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.zone = payload.data;
      state.current_zone = payload.data[0];
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchAdminBookingZone.rejected, (state, action) => {
      state.loading = false;
      state.zone = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(fetchBookingZone.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookingZone.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.zone = payload.data;
      state.current_zone = payload.data[0];
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBookingZone.rejected, (state, action) => {
      state.loading = false;
      state.zone = [];
      state.error = action.error.message;
    });
  },
  reducers: {
    setCurrentZone(state, action) {
      const { payload } = action;
      state.current_zone = { ...payload };
    },
  },
});

export const { setCurrentZone } = bookingZoneSlice.actions;
export default bookingZoneSlice.reducer;
