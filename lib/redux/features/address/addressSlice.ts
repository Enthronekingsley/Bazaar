import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addressDummyData } from "@/assets/assets";

export type Address = typeof addressDummyData;

export interface AddressState {
  list: Address[];
}

const initialState: AddressState = {
  list: [addressDummyData],
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      state.list.push(action.payload);
    },
  },
});

export const { addAddress } = addressSlice.actions;
export default addressSlice.reducer;
