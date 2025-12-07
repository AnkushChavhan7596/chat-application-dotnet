namespace ChatApplication.API.Models.Dto
{
    public class MessageResponseDto
    {
        public Guid Id { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string Text { get; set; }
        public DateTime SentAt { get; set; }

        public string? MediaUrl { get; set; }
        public string? MediaType { get; set; }

        public bool IsSeen { get; set; } = false;
        public DateTime? SeenAt { get; set; }
    }
}
