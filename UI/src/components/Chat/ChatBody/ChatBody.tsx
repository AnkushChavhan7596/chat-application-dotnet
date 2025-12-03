import { useRef } from "react";
import "./ChatBody.css"
import ChatFooter from '../ChatFooter/ChatFooter'
import { useAppSelector } from "../../../store/hooks";
import { MessageDto, messageService, SendMessageRequest } from "../../../services/messageService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCurrentChat } from "../../../store/slices/chatSlice";
import { clearUser } from "../../../store/slices/authSlice";
import { formatToLocalTime } from "../../../utils/dateUtil";
import { getConnection, startConnection } from "../../../services/signalRService";

const ChatBody = () => {
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const currentChat = useAppSelector((state) => state.chat.currentChat);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [isTyping, setIsTyping] = useState<Boolean>(false);

    // handle unauthorize or session expire
    const handleUnauthorized = () => {
        // clean local storage
        localStorage.removeItem("token");
        localStorage.removeItem("currentChat")
        localStorage.removeItem("loggedInUser")

        // reseting the store current chat
        dispatch(clearCurrentChat())

        // reseting the store user
        dispatch(clearUser());

        navigate("/login", { replace: true });
        alert("Session expired, please login!");
    }

    // handle message send
    const onMessageSend = async (text: any) => {
        const data: SendMessageRequest | any = {
            senderId: currentChat?.currentUser?.id,
            receiverId: currentChat?.targetUser?.id,
            text: text
        };

        try {
            const sentMessage = await messageService.sendMessage(data);
            setMessages(prev => [...prev, sentMessage]);
            console.log("Sent Message : ", sentMessage)
        } catch (error: any) {
            // If API returns 401 → user must login again
            if (error.response?.status === 401) {
                handleUnauthorized();
            }
            console.error("Message send error:", error);
        }
    }

    // load messages between the chat users
    const loadMessagesBetweenUsers = async () => {
        try {
            const msgs = await messageService.getMessagesBetweenUsers(currentChat?.currentUser?.id, currentChat?.targetUser?.id);
            setMessages(msgs);
        } catch (error: any) {
            // If API returns 401 → user must login again
            if (error.response?.status === 401) {
                handleUnauthorized();
            }
            console.error("Message load error:", error);
        }
    }

    useEffect(() => {
        loadMessagesBetweenUsers();
    }, [currentChat]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // handle realtime messaging using signalR
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return; // important

        startConnection();

        const conn = getConnection();
        // console.log("connection while recieving mesg : ", conn)
        if (!conn) return;

        // For message send and recieve in realtime using signalR
        conn.on("ReceiveMessage", (msg: any) => {
            if (
                msg.senderId === currentChat?.targetUser?.id ||
                msg.receiverId === currentChat?.targetUser?.id
            ) {
                setMessages(prev => [...prev, msg]);
            }
        });

        // For Typing indicator - start
        conn.on("UserTyping", (data: any) => {
            console.log("Typing response from singlaR event : ", data)

            // only show typing indicator if its coming from the target user
            if (data?.senderId == currentChat?.targetUser?.id) {
                setIsTyping(data?.isTyping);
            }

        });

        return () => {
            conn.off("ReceiveMessage");
            conn.off("UserTyping");
        };
    }, [currentChat]);


    return (
        <div className="chat-body">

            <div className="chats">
                {
                    messages?.map(msg => {
                        return (
                            currentChat?.currentUser?.id == msg.senderId ?
                                <div className="sent" key={msg?.id}>
                                    <div className="msg">
                                        <p className="text">{msg?.text}</p>
                                        <p className="time">{formatToLocalTime(msg?.sentAt)}</p>
                                    </div>
                                </div>
                                :
                                <div className="recieved" key={msg?.id}>
                                    <div className="msg">
                                        <p className="text">{msg?.text}</p>
                                        <p className="time">{formatToLocalTime(msg?.sentAt)}</p>
                                    </div>
                                </div>
                        )
                    })
                }

                {isTyping && <p className="typing-indicator">Typing...</p>}

                <div ref={bottomRef} className="bottom-ref"></div>
            </div>


            {/* Chat footer */}
            <ChatFooter onSend={onMessageSend} />
        </div>
    )
}

export default ChatBody