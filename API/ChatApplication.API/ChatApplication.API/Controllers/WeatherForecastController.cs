using ChatApplication.API.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ChatApplication.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries =
        [
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        ];

        [HttpGet(Name = "GetWeatherForecast")]
        [Authorize]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet]
        [Authorize(Roles = "Writer")]
        [Route("writer-role")]
        public IActionResult WriterTestMethod()
        {
            return Ok("This endpoint is only accessible, for the user with Writer role");
        }

        [HttpGet]
        [Authorize(Roles = "Reader")]
        [Route("reader-role")]
        public IActionResult ReaderTestMethod()
        {
            return Ok("This endpoint is only accessible, for the user with Reader role");
        }

        [HttpGet]
        [Authorize(Roles = "Reader,Writer")]
        [Route("reader-or-writer-role")]
        public IActionResult ReaderWriterTestMethod()
        {
            return Ok("This endpoint is only accessible, for the user with Reader and Writer role");
        }
    }
}
