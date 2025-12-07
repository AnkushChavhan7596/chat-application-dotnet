using ChatApplication.API.Data;
using ChatApplication.API.Hubs;
using ChatApplication.API.Models.Domain;
using ChatApplication.API.Models.Dto;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.API.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthDbContext _authDb;
        private readonly IHubContext<ChatHub> _hub;

        public MessageRepository(
            ApplicationDbContext db, 
            IHubContext<ChatHub> hub,
            AuthDbContext authDb)
        {
            _db = db;
            _hub = hub;
            _authDb = authDb;
        }

        // Get chat history between the users
        public async Task<List<Message>> GetChatHistory(string currentUserId, string targetUserId)
        {
            var messages = await _db.Messages.Where(m => (m.SenderId == currentUserId && m.ReceiverId == targetUserId) ||
                                          (m.SenderId == targetUserId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return messages;
        }

        // Mark as seen
        public async Task MarkAsSeen(string senderId, string receiverId)
        {
            var messages = await _db.Messages
                .Where(m => m.SenderId == receiverId &&
                            m.ReceiverId == senderId &&
                            !m.IsSeen)
                .ToListAsync();

            foreach (var msg in messages)
            {
                msg.IsSeen = true;
                msg.SeenAt = DateTime.UtcNow;
            }

            if (messages.Any())
            {
                // Notify receiver in real time that messages has been read
                await _hub.Clients.User(receiverId) 
                    .SendAsync("MessageRead", new { 
                        senderId = senderId, 
                        receiverId = receiverId}
                    );
            }

            await _db.SaveChangesAsync();
        }

        // Send message
        public async Task<Message> SendMessageAsync(Message message)
        {
            // storing message in db
            _db.Messages.Add(message);
            await _db.SaveChangesAsync();

            // Notify receiver in real time
            await _hub.Clients.User(message.ReceiverId)
                .SendAsync("ReceiveMessage", new MessageResponseDto
                {
                    Id = message.Id,
                    SenderId = message.SenderId,
                    ReceiverId = message.ReceiverId,
                    Text = message.Text,
                    SentAt = message.SentAt
                });

            // send updated unread count
            var unreadCount = await GetUnreadCount(message.ReceiverId);

            await _hub.Clients.User(message.ReceiverId)
                .SendAsync("UnreadCountUpdated", new
                {
                    unreadCount = unreadCount,
                    senderId = message.SenderId
                });

            return message;
        }

        private async Task<int> GetUnreadCount(string receiverId)
        {
            return await _db.Messages
                .Where(m => m.ReceiverId == receiverId && !m.IsSeen)
                .CountAsync();
        }
    }
}
