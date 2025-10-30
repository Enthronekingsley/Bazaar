import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Ratings {
  ratings: number[];
}

const initialState: Ratings = {
  ratings: [],
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    addRating: (state, action: PayloadAction<number>) => {
      state.ratings.push(action.payload);
    },
  },
});

export const { addRating } = ratingSlice.actions;

export default ratingSlice.reducer;
