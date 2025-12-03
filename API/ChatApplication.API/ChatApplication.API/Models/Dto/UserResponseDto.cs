using System.ComponentModel.DataAnnotations;

namespace ChatApplication.API.Models.Dto
{
    public class UserResponseDto
    {
        [Required]
        public required string Id { get; set; }

        [Required]
        public required string DisplayName { get; set; }

        public string? Email { get; set; }

        public string? Status { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime? LastSeen { get; set; }
    }
}
