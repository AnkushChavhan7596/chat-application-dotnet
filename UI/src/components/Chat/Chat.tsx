import "./Chat.css"
import ChatBody from "./ChatBody/ChatBody"
import ChatFooter from "./ChatFooter/ChatFooter"
import ChatHeader from "./ChatHeader/ChatHeader"

const Chat = () => {
    return (
        <div className="chat">
            {/* header */}
            <ChatHeader />

            {/* Chat body */}
            <ChatBody />
        </div>
    )
}

export default Chat