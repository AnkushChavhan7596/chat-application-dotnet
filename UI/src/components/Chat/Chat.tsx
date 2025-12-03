import { useAppSelector } from "../../store/hooks"
import "./Chat.css"
import ChatBody from "./ChatBody/ChatBody"
import ChatHeader from "./ChatHeader/ChatHeader"

const Chat = () => {
    const currentChat = useAppSelector((state) => state.chat.currentChat);

    const isChatActive = currentChat && (currentChat?.targetUser && currentChat?.currentUser);

    return (
        <div className="chat">
            {isChatActive &&
                <>
                    {/* header */}
                    <ChatHeader />

                    {/* Chat body */}
                    <ChatBody />
                </>
            }

            {
                !isChatActive &&
                <div className="start-conv">
                    <p className="title">Start Conversation</p>
                </div>
            }
        </div>
    )
}

export default Chat