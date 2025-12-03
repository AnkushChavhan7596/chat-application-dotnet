using ChatApplication.API.Data;
using ChatApplication.API.Models.Domain;
using ChatApplication.API.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AuthDbContext _authDb;

        public UserRepository(AuthDbContext authDb)
        {
            _authDb = authDb;
        }

        // Get all users
        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            var adminEmail = "admin@gmail.com"; // don't include admin email

            return await _authDb.Users
                 .Where(u => u.Email != adminEmail)
                 .Select(u => new UserResponseDto
                 {
                     Id = u.Id,
                     DisplayName = u.DisplayName,
                     Email = u.Email,
                     Status = u.Status,
                     ProfilePictureUrl = u.ProfilePictureUrl,
                     LastSeen = u.LastSeen
                 })
                 .AsNoTracking()
                 .ToListAsync();
        }

        // Get all users except provided
        public async Task<List<UserResponseDto>> GetAllUsersExecptProvided(string userId)
        {
            var adminEmail = "admin@gmail.com"; // don't include admin email

            return await _authDb.Users
                    .Where(u => u.Id != userId && u.Email != adminEmail)
                    .Select(u => new UserResponseDto
                    {
                        Id = u.Id,
                        DisplayName = u.DisplayName,
                        Email = u.Email,
                        Status = u.Status,
                        ProfilePictureUrl = u.ProfilePictureUrl,
                        LastSeen = u.LastSeen
                    })
                   .AsNoTracking()
                   .ToListAsync();
        }
    }
}
