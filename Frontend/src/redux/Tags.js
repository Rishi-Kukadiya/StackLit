import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching paginated tags
export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async ({ page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/tags/get-tags`,
        {
          params: { page, limit },
          withCredentials: true,
        }
      );
      return res.data;
      console.log("Tags fetched successfully:", res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tags");
    }
  }
);

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    tags: [],
    total: 0,
    page: 1,
    limit: 12,
    loading: false,
    error: "",
    hasMore: true,
  },
  reducers: {
    resetTags: (state) => {
      state.tags = [];
      state.page = 1;
      state.hasMore = true;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        const { tags = [], totalTags = 0 } = action.payload;
        state.tags = [...state.tags, ...tags];
        state.total = totalTags;
        state.page += 1;
        state.hasMore = tags.length > 0;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tags";
      });
  },
});

export const { resetTags } = tagsSlice.actions;
export default tagsSlice.reducer;
