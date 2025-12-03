import { CurrentChat } from "../store/slices/chatSlice";

export const saveCurrentChatToLocal = (currentChat: CurrentChat) => {
  localStorage.setItem("currentChat", JSON.stringify(currentChat));
};

export const clearCurrentChatFromLocal = () => {
  localStorage.removeItem("currentChat");
}

export const getCurrentChatFromLocal = () => {
  const c = localStorage.getItem("currentChat");
  return c ? JSON.parse(c) : null;
};
