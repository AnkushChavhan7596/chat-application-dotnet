import { useState } from "react";
import "./ChatFooter.css";
import { getConnection } from "../../../services/signalRService";
import { useAppSelector } from "../../../store/hooks";

const ChatFooter = ({ onSend }: any) => {
    const [text, setText] = useState("");
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const conn = getConnection();
    const currentChat = useAppSelector((state) => state.chat.currentChat);

    const handleSend = () => {
        if (!text.trim()) return;

        onSend(text);        // 🔥 emit text to parent
        setText("");         // clear input
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const handleTextChange = (e: any) => {
        setText(e.target.value)

        // Notify typing started
        conn.invoke("TypingStarted", currentChat?.targetUser?.id);

        // Clear previous timeout
        if (typingTimeout) clearTimeout(typingTimeout);

        // Typing stops after 2 seconds of inactivity
        const timeout = setTimeout(() => {
            conn.invoke("TypingStopped", currentChat?.targetUser?.id);
        }, 1000);

        setTypingTimeout(timeout);
    }

    return (
        <div className="footer">
            <input
                type="text"
                className="type-box"
                placeholder="Type Something ..."
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
            />

            <div className="send-wrapper">
                <img src="https://cdn-icons-png.flaticon.com/128/8138/8138518.png" alt="attachment" />
                <img src="https://cdn-icons-png.flaticon.com/128/10929/10929794.png" alt="add-image" />
                <button className='send-btn' onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatFooter;
