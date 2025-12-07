using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ChatApplication.API.Models.Domain
{
    public class Message
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string SenderId { get; set; }
        public string ReceiverId { get; set; }

        public string Text { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public bool IsSeen { get; set; } = false;
        public DateTime? SeenAt { get; set; }
    }
}
