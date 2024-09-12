import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/product';
import sellerProductService from '../../services/seller/product';

const initialState = {
  loading: false,
  products: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchPosProducts = createAsyncThunk(
  'possystem/fetchPosProducts',
  (params = {}) => {
    return productService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchPosSellerProducts = createAsyncThunk(
  'possystem/fetchPosSellerProducts',
  (params = {}) => {
    return sellerProductService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const posSystemSlice = createSlice({
  name: 'posSystem',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPosProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPosProducts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.products = payload.data.map((item) => ({
        ...item,
        id: item.id,
        uuid: item.uuid,
        name: item.translation ? item.translation.title : 'no name',
        active: item.active,
        img: item.img,
        category_name: item.category?.translation
          ? item.category.translation.title
          : 'no name',
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchPosProducts.rejected, (state, action) => {
      state.loading = false;
      state.products = [];
      state.error = action.error.message;
    });

    //seller product
    builder.addCase(fetchPosSellerProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPosSellerProducts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.products = payload.data?.map((item) => ({
        ...item,
        id: item.id,
        uuid: item.uuid,
        name: item?.translation ? item?.translation.title : 'no name',
        active: item.active,
        img: item?.img,
        category_name: item?.category?.translation
          ? item?.category?.translation?.title
          : 'no name',
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchPosSellerProducts.rejected, (state, action) => {
      state.loading = false;
      state.products = [];
      state.error = action.error.message;
    });
  },
});

export default posSystemSlice.reducer;
