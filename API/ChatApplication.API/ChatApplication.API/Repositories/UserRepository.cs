using ChatApplication.API.Data;
using ChatApplication.API.Models.Domain;
using ChatApplication.API.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AuthDbContext _authDb;
        private readonly ApplicationDbContext _db;

        public UserRepository(AuthDbContext authDb, ApplicationDbContext db)
        {
            _authDb = authDb;
            _db = db;
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
            var adminEmail = "admin@gmail.com";

            // 1️⃣ Get unread message counts per sender (Chat DB)
            var unreadCounts = await _db.Messages
                .Where(m => m.ReceiverId == userId && !m.IsSeen)
                .GroupBy(m => m.SenderId)
                .Select(g => new
                {
                    SenderId = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var unreadCountDict = unreadCounts
                .ToDictionary(x => x.SenderId, x => x.Count);

            // 2️⃣ Get users (Auth DB)
            var users = await _authDb.Users
                .Where(u => u.Id != userId && u.Email != adminEmail)
                .AsNoTracking()
                .ToListAsync();

            // 3️⃣ Map users + unread count (in memory)
            return users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                DisplayName = u.DisplayName,
                Email = u.Email,
                Status = u.Status,
                ProfilePictureUrl = u.ProfilePictureUrl,
                LastSeen = u.LastSeen,
                UnreadCount = unreadCountDict.TryGetValue(u.Id, out var count) ? count : 0
            })
            .ToList();
        }

    }
}
