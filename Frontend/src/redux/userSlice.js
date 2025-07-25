import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/users/get-users`, {
        params: {
          page,
          limit
        },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    total: 0,
    page: 1,
    limit: 12,
    loading: false,
    error: "",
    hasMore: true,
  },
  reducers: {
    resetUsers: (state) => {
      state.users = [];
      state.page = 1;
      state.hasMore = true;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const { users = [], total = 0 } = action.payload;
        state.users = [...state.users, ...users];
        state.total = total;
        state.page += 1;
        state.hasMore = users.length > 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export const { resetUsers } = userSlice.actions;
export default userSlice.reducer;
