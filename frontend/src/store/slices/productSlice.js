import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchProducts = createAsyncThunk('products/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchFeaturedProducts = createAsyncThunk('products/featured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featured: [],
    pagination: null,
    loading: false,
    featuredLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.items = payload.data || [];
        state.pagination = {
          currentPage: payload.current_page,
          lastPage: payload.last_page,
          total: payload.total,
          perPage: payload.per_page,
        };
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })
      .addCase(fetchFeaturedProducts.pending, (state) => { state.featuredLoading = true; })
      .addCase(fetchFeaturedProducts.fulfilled, (state, { payload }) => {
        state.featured = payload;
        state.featuredLoading = false;
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => { state.featuredLoading = false; });
  },
});

export default productSlice.reducer;
