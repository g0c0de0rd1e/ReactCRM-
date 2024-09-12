import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import myGalleries from '../../services/my-branch-galleries';

const initialState = {
  loading: false,
  gallery: [],
  data: null,
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchGallery = createAsyncThunk(
  'gallery/fetchGallery',
  (params = {}) => {
    return myGalleries
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerGallery = createAsyncThunk(
  'gallery/fetchSellerGallery',
  (params = {}) => {
    return myGalleries
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchGallery.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGallery.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.gallery = payload?.data?.galleries;
      state.data = payload?.data;
      state.error = '';
    });
    builder.addCase(fetchGallery.rejected, (state, action) => {
      state.loading = false;
      state.gallery = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(fetchSellerGallery.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerGallery.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.gallery = payload?.data?.galleries;
      state.data = payload?.data;
      state.error = '';
    });
    builder.addCase(fetchSellerGallery.rejected, (state, action) => {
      state.loading = false;
      state.gallery = [];
      state.error = action.error.message;
    });
  },
});

export default gallerySlice.reducer;
