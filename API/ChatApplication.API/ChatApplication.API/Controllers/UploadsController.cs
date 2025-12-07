using ChatApplication.API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatApplication.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly IUploadRepository _uploadRepository;

        public UploadsController(IUploadRepository uploadRepository)
        {
            _uploadRepository = uploadRepository;
        }

        // POST: api/uploads
        [HttpPost]
        public async Task<IActionResult> UploadMedia(
            [FromForm] IFormFile file,
            [FromForm] string senderId,
            [FromForm] string receiverId,
            [FromForm] string? text
        )
        {
            
            var message = await _uploadRepository.UploadMedia(
                file,
                text,
                senderId,
                receiverId
            );

            return Ok(message);
        }
    }
}
