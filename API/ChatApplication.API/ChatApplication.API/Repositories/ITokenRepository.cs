using ChatApplication.API.Models.Domain;
using Microsoft.AspNetCore.Identity;

namespace ChatApplication.API.Repositories
{
    public interface ITokenRepository
    {
        string CreateJwtToken(ApplicationUser user, List<string> roles);
    }
}
