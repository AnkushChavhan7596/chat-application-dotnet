import { useRef, useState } from "react";
import "./ChatFooter.css";
import { getConnection } from "../../../services/signalRService";
import { useAppSelector } from "../../../store/hooks";

const ChatFooter = ({ onSend }: any) => {
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isImageWrapperVisible, setImageWrapperVisible] = useState(false);

    const conn = getConnection();
    const currentChat = useAppSelector((state) => state.chat.currentChat);

    const handleSend = () => {
        console.log("File : ", file, "Text : ", text)
        if (!text.trim() && !file) return;

        onSend({
            text: text.trim(),
            file
        });

        setText("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const handleTextChange = (e: any) => {
        setText(e.target.value);

        conn.invoke("TypingStarted", currentChat?.targetUser?.id);

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            conn.invoke("TypingStopped", currentChat?.targetUser?.id);
        }, 1000);

        setTypingTimeout(timeout);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setImageWrapperVisible(true)
        }
    };

    return (
        <div>
            {file && isImageWrapperVisible && (
                <div className="sel-img-wrapper">
                    {file.type.startsWith("image") && (
                        <img
                            src={URL.createObjectURL(file)}
                            className="preview-image"
                            alt="preview"
                        />
                    )}

                    {file.type.startsWith("video") && (
                        <video
                            src={URL.createObjectURL(file)}
                            controls
                            className="preview-video"
                        />
                    )}

                    {file.type.startsWith("audio") && (
                        <audio
                            src={URL.createObjectURL(file)}
                            controls
                        />
                    )}

                    {!file.type.startsWith("image") &&
                        !file.type.startsWith("video") &&
                        !file.type.startsWith("audio") && (
                            <p style={{ marginTop: '10px'}}>📎 {file.name}</p>
                        )}

                    <div className="close" onClick={() => { setImageWrapperVisible(false); setFile(null); }}>X</div>
                </div>
            )}

            <div className="footer">
                <input
                    type="text"
                    className="type-box"
                    placeholder="Type Something ..."
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                />

                {/* hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*,video/*,audio/*,.pdf"
                    onChange={handleFileSelect}
                />

                <div className="send-wrapper">
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/8138/8138518.png"
                        alt="attachment"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ cursor: "pointer" }}
                    />

                    <img
                        src="https://cdn-icons-png.flaticon.com/128/10929/10929794.png"
                        alt="add-image"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ cursor: "pointer" }}
                    />

                    <button className='send-btn' onClick={handleSend}>Send</button>
                </div>


            </div>
        </div>
    );
};

export default ChatFooter;
