using System.ComponentModel.DataAnnotations;

namespace ChatApplication.API.Models.Dto
{
    public class SendMessageRequestDto
    {
        [Required]
        public string SenderId { get; set; }

        [Required]
        public string ReceiverId { get; set; }

        [Required]
        public string Text { get; set; }
    }
}
