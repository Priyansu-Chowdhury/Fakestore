import { createSlice } from "@reduxjs/toolkit";

export interface CartSheetSliceState {
  isOpen: boolean;
}

const initialState: CartSheetSliceState = {
  isOpen: false,
};

const cartSheetSlice = createSlice({
  name: "cartSheet",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { open, close, toggle } = cartSheetSlice.actions;

export default cartSheetSlice.reducer;
