import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  signer : any | null;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  chainId: null,
  signer : null
};

// Wallet slice to handle actions
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletInfo: (state, action: PayloadAction<Partial<WalletState>>) => {
      return { ...state, ...action.payload };
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.isConnected = false;
      state.chainId = null;
    },
  },
});

export const { setWalletInfo, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer;