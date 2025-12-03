using ChatApplication.API.Models.Domain;
using ChatApplication.API.Models.Dto;

namespace ChatApplication.API.Repositories
{
    public interface IUserRepository
    {
        public Task<List<UserResponseDto>> GetAllUsersAsync();

        public Task<List<UserResponseDto>> GetAllUsersExecptProvided(string userId);
    }
}
