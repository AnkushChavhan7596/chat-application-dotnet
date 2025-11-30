using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ChatApplication.API.Models.Domain
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        public string DisplayName { get; set; }

        public string? ProfilePictureUrl { get; set; }

        public string? Status {  get; set; }

        public DateTime? LastSeen { get; set; } 
    }
}
