import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ product_id, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart/add', { product_id, quantity });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/clear');
    return { items: [], total: 0, items_count: 0 };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    itemsCount: 0,
    loading: false,
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemsCount = 0;
    },
  },
  extraReducers: (builder) => {
    const setCartData = (state, { payload }) => {
      state.items = payload.items || [];
      state.total = payload.total || 0;
      state.itemsCount = payload.items_count || 0;
      state.loading = false;
    };
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, setCartData)
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })
      .addCase(addToCart.fulfilled, setCartData)
      .addCase(updateCartItem.fulfilled, setCartData)
      .addCase(removeCartItem.fulfilled, setCartData)
      .addCase(clearCart.fulfilled, setCartData);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
