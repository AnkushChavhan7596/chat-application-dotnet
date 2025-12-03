using ChatApplication.API.Models.Domain;

namespace ChatApplication.API.Repositories
{
    public interface IMessageRepository
    {
        public Task<Message> SendMessageAsync(Message message);

        public Task<List<Message>> GetChatHistory(string currentUserId, string targetUserId);
    }
}
