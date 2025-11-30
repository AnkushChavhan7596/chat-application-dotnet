using ChatApplication.API.Models.Domain;
using ChatApplication.API.Models.Dto;
using ChatApplication.API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;

namespace ChatApplication.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ITokenRepository tokenRepository;
        
        public AuthController(
            UserManager<ApplicationUser> userManager,
            ITokenRepository tokenRepository
        )
        {
            this.tokenRepository = tokenRepository;
            this.userManager = userManager;
        }


        // POST : {apibaseurl}/api/auth/register
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            // Check if user already exists
            if (await userManager.FindByEmailAsync(request.Email) != null)
            {
                ModelState.AddModelError("email", "Email already registered.");
                return ValidationProblem(ModelState);
            }

            // Create ApplicationUser object
            var user = new ApplicationUser
            {
                UserName = request.Email?.Trim(),
                Email = request.Email?.Trim(),
                DisplayName = request.DisplayName,
                ProfilePictureUrl = request.ProfilePictureUrl,
                Status = "offline",
                LastSeen = null
            };

            // Create user
            var identityResult = await userManager.CreateAsync(user, request.Password);

            if (!identityResult.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Registration failed",
                    errors = identityResult.Errors.Select(e => e.Description)
                });
            }

            // Assign Reader role
            var roleResult = await userManager.AddToRoleAsync(user, "Reader");

            if (!roleResult.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Failed to assign user role",
                    errors = roleResult.Errors.Select(e => e.Description)
                });
            }

            return Ok(new { message = "User registered successfully" });
        }

        // POST : {apibaseurl}/api/auth/login
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var email = request.Email?.Trim().ToLower();

            // check user with email present or not
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials." });

            // check password match
            var passwordValid = await userManager.CheckPasswordAsync(user, request.Password);

            if (!passwordValid)
                return Unauthorized(new { message = "Invalid credentials." });

            // Update user last seen
            user.LastSeen = DateTime.UtcNow;
            await userManager.UpdateAsync(user);

            var roles = await userManager.GetRolesAsync(user);

            // Create Jwt token
            var token = tokenRepository.CreateJwtToken(user, roles.ToList());

            return Ok(new LoginResponseDto
            {
                Email = user.Email,
                Roles = roles.ToList(),
                Token = token
            });
        }

    }
}
