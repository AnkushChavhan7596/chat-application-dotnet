import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  token: string;
  roles: string[],
  isOnline?: boolean,
  lastSeen: string,
  unreadCount: number
}

interface AuthState {
  user: AuthUser | null;
  onlineUserIds : string[] | any
}

const initialState: AuthState = {
  user: null,
  onlineUserIds : []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setOnlineUserIds: (state, action: PayloadAction<any>) => {
      state.onlineUserIds = action.payload
    },
    clearOnlineUserIds: (state) => {
      state.onlineUserIds = []
    }
  }
});

export const { setUser, clearUser, setOnlineUserIds, clearOnlineUserIds } = authSlice.actions;
export default authSlice.reducer;
