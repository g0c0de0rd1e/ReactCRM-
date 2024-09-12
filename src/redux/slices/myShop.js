import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopService from '../../services/seller/shop';
import { DEMO_ADMIN } from 'configs/app-global';

const initialState = {
  loading: false,
  myShop: {},
  params: {
    page: 1,
    perPage: 10,
    shop_id: DEMO_ADMIN,
  },
  error: '',
};

export const fetchMyBranch = createAsyncThunk(
  'shop/fetchMyBranch',
  (params = {}) => {
    return shopService
      .get({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchMyShop = createAsyncThunk(
  'shop/fetchMyShop',
  (params = {}) => {
    return shopService.get({ ...params }).then((res) => res);
  }
);

const myShopSlice = createSlice({
  name: 'myShop',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMyBranch.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMyBranch.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.myShop = payload.data;
      state.error = '';
    });
    builder.addCase(fetchMyBranch.rejected, (state, action) => {
      state.loading = false;
      state.myShop = {};
      state.error = action.error.message;
    });

    // seller branch
    builder.addCase(fetchMyShop.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMyShop.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.myShop = payload.data;
      state.error = '';
    });
    builder.addCase(fetchMyShop.rejected, (state, action) => {
      state.loading = false;
      state.myShop = {};
      state.error = action.error.message;
    });
  },
});

export default myShopSlice.reducer;
