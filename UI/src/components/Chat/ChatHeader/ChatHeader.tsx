import "./ChatHeader.css"

const ChatHeader = () => {
    return (
        <div className="chat-header">
            <div className="left">
                <h2 className="name">Rushikesh Dudhe</h2>
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