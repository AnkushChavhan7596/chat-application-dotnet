using ChatApplication.API.Models.Domain;
using ChatApplication.API.Models.Dto;
using ChatApplication.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApplication.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageRepository _messageRepository;

        public MessagesController(
            IMessageRepository messageRepository
        )
        {
            this._messageRepository = messageRepository;
        }

        // POST : api/messages
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequestDto request)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            // dto to domain model
            var message = new Message
            {
                SenderId = request.SenderId,
                ReceiverId = request.ReceiverId,
                Text = request.Text,
                SentAt = DateTime.UtcNow
            };

            // store message to db and trigger signalR event
            await _messageRepository.SendMessageAsync(message);

            return Ok(new { message = "Message sent" });
        }

        // GET : api/messages
        [HttpGet]
        [Route("{currentUserId}/{targetUserId}")]
        public async Task<IActionResult> GetChatHistory([FromRoute] string currentUserId, [FromRoute] string targetUserId)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            // get messages between the users
            var messages = await _messageRepository.GetChatHistory(currentUserId, targetUserId);

            return Ok(messages);
        }
    }
}
