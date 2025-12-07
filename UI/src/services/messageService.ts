// services/messageService.ts
import axios from "axios";

const API_BASE_URL = "https://localhost:7229";

// -------------------------------------
// Interfaces / DTOs
// -------------------------------------

export interface SendMessageRequest {
  senderId: string;
  receiverId: string;
  text: string;
}

export interface MessageDto {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  sentAt: string;
}

// ----------------------------------------------------
// Helper: Get Auth Header
// ----------------------------------------------------
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// -------------------------------------
// Message Service
// -------------------------------------

export const messageService = {
  // ✔️ Send a new message
  sendMessage: async (data: SendMessageRequest): Promise<MessageDto> => {
    try{
      const response = await axios.post<MessageDto>(
        `${API_BASE_URL}/api/messages`,
        data,
        getAuthHeaders()
      );
      return response.data;
    }catch(error: any){
      throw error;
    }
  },

  // Send a message with with media
  sendMessageWithMedia: async (data: any) => {
    try{
      const formData = new FormData();
        formData.append("file", data.file);
        formData.append("text", data.text);
        formData.append("receiverId", data.receiverId);
        formData.append("senderId", data.senderId);

      const response = await axios.post<any>(
        `${API_BASE_URL}/api/uploads`,
        formData,
        getAuthHeaders()
      );
      return response.data;
    }catch(error: any){
      throw error;
    }
  },

  // ✔️ Get chat history between users
  getMessagesBetweenUsers: async (
    currentUserId: string | undefined,
    targetUserId: string | undefined
  ): Promise<MessageDto[]> => {
    try{
      const response = await axios.get<MessageDto[]>(
      `${API_BASE_URL}/api/messages/${currentUserId}/${targetUserId}`,
      getAuthHeaders()
    );
    return response.data;
    }catch(error: any){
      throw error;
    }
  },

  // ✔️ Mark messages as read
  markMessagesAsRead: async (senderId: string | undefined, receiverId: string | undefined) => {
    try{
       const response = await axios.put(
      `${API_BASE_URL}/api/messages/mark-as-seen/${senderId}/${receiverId}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    }catch(error: any){
      throw error;
    }
  }
};
