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
        private readonly IHubContext<ChatHub> _hub;

        public MessageRepository(ApplicationDbContext db, IHubContext<ChatHub> hub)
        {
            _db = db;
            _hub = hub;
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


        // Send message
        public async Task SendMessageAsync(Message message)
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
        }
    }
}
