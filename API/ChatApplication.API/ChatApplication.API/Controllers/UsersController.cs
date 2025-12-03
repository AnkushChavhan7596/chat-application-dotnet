using ChatApplication.API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatApplication.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // GET : api/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();

            return Ok(users);
        }

        // GET : api/users/{userId}
        [HttpGet]
        [Route("{userId}")]
        public async Task<IActionResult> GetAllUsersAsync([FromRoute] string userId)
        {
            var users = await _userRepository.GetAllUsersExecptProvided(userId);

            return Ok(users);
        }
    }
}
