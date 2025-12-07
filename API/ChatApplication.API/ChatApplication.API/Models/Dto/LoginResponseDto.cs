namespace ChatApplication.API.Models.Dto
{
    public class LoginResponseDto
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public List<string> Roles { get; set; }
        public DateTime? LastSeen { get; set; }

    }
}
