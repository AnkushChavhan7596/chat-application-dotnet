namespace ChatApplication.API.Models.Dto
{
    public class MessageResponseDto
    {
        public Guid Id { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string Text { get; set; }
        public DateTime SentAt { get; set; } 
    }
}
