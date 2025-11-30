import "./ChatFooter.css"

const ChatFooter = () => {
    return (
        <div className="footer">
            <input type="text" className="type-box" placeholder='Type Something ...' />

            <div className="send-wrapper">
                <img src="https://cdn-icons-png.flaticon.com/128/8138/8138518.png" alt="attachment" />
                <img src="https://cdn-icons-png.flaticon.com/128/10929/10929794.png" alt="add-image" />
                <button className='send-btn'>Send</button>
            </div>
        </div>
    )
}

export default ChatFooter