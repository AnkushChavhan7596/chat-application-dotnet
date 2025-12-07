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
import { formatToLocalTime, groupMessagesByDay } from "../../../utils/dateUtil";
import { getConnection, startConnection } from "../../../services/signalRService";
import sentImage from "../../../assets/double-tick.png"
import seenImage from "../../../assets/double-checked.png"

const ChatBody = () => {
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const currentChat = useAppSelector((state) => state.chat.currentChat);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [isTyping, setIsTyping] = useState<Boolean>(false);
    const [groupedMessages, setGroupedMessages] = useState<any>({});

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

    // handle plane msg send
    const handlePlaneMsgSend = async (text: any) => {
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
    // handle msg with media send
    const handleMsgSendWithMedia = async (msgData: any) => {
        const data: any = {
            senderId: currentChat?.currentUser?.id,
            receiverId: currentChat?.targetUser?.id,
            text: msgData?.text,
            file: msgData?.file
        };

        try {
            const sentMessage = await messageService.sendMessageWithMedia(data);
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

    // handle message send
    const onMessageSend = async (msgData: any) => {
        if (!msgData?.file) {
            handlePlaneMsgSend(msgData?.text);
        }

        if (msgData?.file) {
            handleMsgSendWithMedia(msgData);
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

    // handle logout
    const handleLogout = () => {
        // clean local storage
        localStorage.removeItem("token");
        localStorage.removeItem("currentChat")
        localStorage.removeItem("loggedInUser")

        // reseting the store current chat
        dispatch(clearCurrentChat())

        // reseting the store user
        dispatch(clearUser());

        // stop singnalR connection
        getConnection()?.stop(); // this will update online users as well

        navigate("/login", { replace: true });
    };

    // handle message seen
    const markMessagesAsSeen = async (senderId: any, recieverId: any) => {
        try {
            const msgs = await messageService.markMessagesAsRead(senderId, recieverId);
            console.log(msgs)
        } catch (error: any) {
            // If API returns 401 → user must login again
            if (error.response?.status === 401) {
                handleLogout();
            }
            console.error("Message load error:", error);
        }
    }

    useEffect(() => {
        loadMessagesBetweenUsers();
    }, [currentChat]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, groupedMessages]);

    // handle realtime messaging using signalR
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return; // important

        // startConnection();

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

                markMessagesAsSeen(currentChat?.currentUser?.id, currentChat?.targetUser?.id);

                loadMessagesBetweenUsers();
            }
        });

        // For message read
        conn.on("MessageRead", (msg: any) => {
            console.log("Message read event")
            if (
                msg.senderId === currentChat?.targetUser?.id ||
                msg.receiverId === currentChat?.currentUser?.id
            ) {
                loadMessagesBetweenUsers();
                console.log("Messages has been read in backend, got notification in realtime")
            }
        })

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
            conn.off("MessageRead");
        };
    }, [currentChat]);

    useEffect(() => {
        setGroupedMessages(groupMessagesByDay(messages));
    }, [messages]);


    return (
        <div className="chat-body">

            <div className="chats">
                {Object.keys(groupedMessages)?.map((group, index) => (
                    <div className="group" key={`group${index}`}>
                        <div className="day-seperator">
                            <span>{group}</span>
                        </div>

                        {
                            groupedMessages[group]?.map((msg: any) => {
                                return (
                                    currentChat?.currentUser?.id == msg.senderId ?
                                        <div className="sent" key={msg?.id}>
                                            <div className="msg">
                                                {msg?.mediaUrl && msg?.mediaType?.startsWith("image") && (
                                                    <img src={msg?.mediaUrl} className="chat-image" />
                                                )}

                                                {msg?.mediaType?.startsWith("video") && (
                                                    <video controls src={msg?.mediaUrl} />
                                                )}

                                                {msg?.mediaType?.startsWith("audio") && (
                                                    <audio controls src={msg?.mediaUrl} />
                                                )}

                                                {msg?.mediaType === "application/pdf" && (
                                                    <a href={msg?.mediaUrl} target="_blank" className="doc-media right">View Document</a>
                                                )}

                                                {
                                                    msg?.text &&
                                                    <p className="text">{msg?.text}</p>
                                                }
                                                <p className="time right">
                                                    {formatToLocalTime(msg?.sentAt)}
                                                    {msg?.isSeen && <span><img src={seenImage} alt="seen-image" className="msg-tick" /></span>}
                                                    {!msg?.isSeen && <span><img src={sentImage} alt="sent-image" className="msg-tick" /></span>}
                                                </p>
                                            </div>
                                        </div>
                                        :
                                        <div className="recieved" key={msg?.id}>
                                            <div className="msg">
                                                {msg?.mediaUrl && msg?.mediaType?.startsWith("image") && (
                                                    <img src={msg?.mediaUrl} className="chat-image" />
                                                )}

                                                {msg?.mediaType?.startsWith("video") && (
                                                    <video controls src={msg?.mediaUrl} />
                                                )}

                                                {msg?.mediaType?.startsWith("audio") && (
                                                    <audio controls src={msg?.mediaUrl} />
                                                )}

                                                {msg?.mediaType === "application/pdf" && (
                                                    <a href={msg?.mediaUrl} target="_blank" className="doc-media right">View Document</a>
                                                )}

                                                {
                                                    msg?.text &&
                                                    <p className="text">{msg?.text}</p>
                                                }
                                                <p className="time">{formatToLocalTime(msg?.sentAt)}</p>
                                            </div>
                                        </div>
                                )
                            })
                        }
                    </div>
                ))

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