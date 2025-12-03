// services/usersService.ts
import axios from "axios";
import { AuthUser } from "../store/slices/authSlice";

const API_BASE_URL = "https://localhost:7229/api/users";

// ----------------------
// Interfaces / DTOs
// ----------------------

export interface UserDto {
  id: string;
  displayName: string;
  email: string;
  status: string;
  profilePictureUrl?: string | null;
  lastSeen?: string | null;
}

// ----------------------
// Services
// ----------------------

export const usersService = {
  // ✔️ Get all users
  getAllUsers: async (): Promise<AuthUser[]> => {
    const response = await axios.get<AuthUser[]>(`${API_BASE_URL}`);
    return response.data;
  },

  // ✔️ Get all users except given userId
  getAllUsersExceptProvided: async (userId: string): Promise<AuthUser[]> => {
    const response = await axios.get<AuthUser[]>(`${API_BASE_URL}/${userId}`);
    return response.data;
  }
};
