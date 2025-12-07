import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { clearCurrentChat } from "../../../store/slices/chatSlice";
import { clearCurrentChatFromLocal } from "../../../utils/chat";
import "./ChatHeader.css"
import { formatLastSeen, formatToLocalTime } from "../../../utils/dateUtil";

const ChatHeader = () => {
    const navigate = useNavigate();
    const currentChat = useAppSelector((state) => state.chat.currentChat);
    const onlineUserIds = useAppSelector((state) => state.auth.onlineUserIds);
    const isOnline = onlineUserIds?.includes(currentChat?.targetUser?.id);

    const handleChatClear = () => {
        // clear current chat from store
        clearCurrentChat();

        // clear current chat from local
        clearCurrentChatFromLocal();

        // refresh the page
        navigate(0);
    }

    return (
        <div className="chat-header">
            <div className="left">
                <div className="arrow-left" onClick={handleChatClear}>
                    &lt;
                </div>
                <div>
                    <h2 className="name">{currentChat?.targetUser?.displayName}</h2>
                    <p className="status">{isOnline ? 'online' : `${formatLastSeen(currentChat?.targetUser?.lastSeen)}`}</p>
                </div>
            </div>

            <div className="right">
                <img src="https://cdn-icons-png.flaticon.com/128/4945/4945907.png" alt="video-call" />
                <img src="https://cdn-icons-png.flaticon.com/128/8042/8042425.png" alt="add" />
                <img src="https://cdn-icons-png.flaticon.com/128/12797/12797777.png" alt="more" />
            </div>
        </div>
    )
}

export default ChatHeader