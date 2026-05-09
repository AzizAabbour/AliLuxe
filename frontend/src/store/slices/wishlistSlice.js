import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/wishlist');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product_id, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/wishlist/toggle', { product_id });
    return { ...data, product_id };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    resetWishlist: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, { payload }) => {
        state.items = payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state) => { state.loading = false; })
      .addCase(toggleWishlist.fulfilled, (state, { payload }) => {
        if (!payload.wishlisted) {
          state.items = state.items.filter(i => i.product_id !== payload.product_id);
        }
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
