using ChatApplication.API.Models.Domain;

namespace ChatApplication.API.Repositories
{
    public interface IUploadRepository
    {
        public Task<Message> UploadMedia(IFormFile file, string? text, string senderId, string recieverId);
    }
}
