// services/authService.ts
import axios from "axios";

const API_BASE_URL = "https://localhost:7229/api/auth"; 

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
  profilePictureUrl?: string | null;
}

interface LoginResponse {
    id: string,
    email: string;
    roles: string[];
    token: string;
    displayName: string
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${API_BASE_URL}/register`, data);
    return response.data;
  }
};
