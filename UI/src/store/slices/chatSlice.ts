import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "./authSlice";

export interface CurrentChat {
  currentUser: AuthUser | null | undefined;
  targetUser: AuthUser | null | undefined;
}

export interface ChatState {
  currentChat: CurrentChat;
}

const initialState: ChatState = {
  currentChat: {
    currentUser: null,
    targetUser: null,
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (
      state,
      action: PayloadAction<{ currentUser: AuthUser | null; targetUser: AuthUser | null }>
    ) => {
      state.currentChat = action.payload;
    },

    clearCurrentChat: (state) => {
      state.currentChat = {
        currentUser: null,
        targetUser: null,
      };
    }
  }
});

export const { setCurrentChat, clearCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
