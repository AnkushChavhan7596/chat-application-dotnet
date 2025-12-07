using Azure.Core;
using ChatApplication.API.Data;
using ChatApplication.API.Hubs;
using ChatApplication.API.Models.Domain;
using ChatApplication.API.Models.Dto;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.API.Repositories
{
    public class UploadRepository : IUploadRepository
    {
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContext;
        private readonly ApplicationDbContext _db;
        private readonly IHubContext<ChatHub> _hub;

        public UploadRepository(
            IWebHostEnvironment env, 
            IHttpContextAccessor httpContext, 
            ApplicationDbContext db,
            IHubContext<ChatHub> hub
        )
        {
            _env = env;
            _httpContext = httpContext;
            _db = db;
            _hub = hub;
        }

        public async Task<Message> UploadMedia(
            IFormFile file,
            string text,
            string senderId,
            string receiverId)
        {
            if (file == null || file.Length == 0)
                throw new Exception("Invalid file");

            const long maxSize = 10 * 1024 * 1024; // 10MB
            if (file.Length > maxSize)
                throw new Exception("File too large");

            var allowedTypes = new[]
            {
                "image/jpeg", "image/png", "image/webp",
                "video/mp4", "audio/mpeg", "audio/mp3",
                "application/pdf"
            };

            if (!allowedTypes.Contains(file.ContentType))
                throw new Exception("Unsupported file type");

            // uploads path
            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            // file name
            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // save file
            using (var stream = new FileStream(filePath,
                    FileMode.CreateNew,
                    FileAccess.Write,
                    FileShare.Read))
            {
                await file.CopyToAsync(stream);
            }

            // build file url
            var httpContext = _httpContext.HttpContext
                ?? throw new InvalidOperationException("HTTP Context missing");

            var fileUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}/uploads/{fileName}";

            // create message
            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Text = text,
                SentAt = DateTime.UtcNow,
                MediaType = file.ContentType,
                MediaUrl = fileUrl
            };

            await _db.Messages.AddAsync(message);
            await _db.SaveChangesAsync();

            // notify receiver
            await _hub.Clients.User(receiverId)
                .SendAsync("ReceiveMessage", new MessageResponseDto
                {
                    Id = message.Id,
                    SenderId = message.SenderId,
                    ReceiverId = message.ReceiverId,
                    Text = message.Text,
                    SentAt = message.SentAt,
                    MediaUrl = message.MediaUrl,
                    MediaType = message.MediaType
                });

            // send updated unread count
            var unreadCount = await GetUnreadCount(message.ReceiverId);

            await _hub.Clients.User(message.ReceiverId)
                .SendAsync("UnreadCountUpdated", new {
                    unreadCount = unreadCount,
                    senderId = message.SenderId
                });

            return message;
        }

        private async Task<int> GetUnreadCount(string receiverId)
        {
            return await _db.Messages
                .Where(m => m.ReceiverId == receiverId && !m.IsSeen)
                .CountAsync();
        }

    }
}
