using ChatApplication.API.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Message> Messages { get; set; }
    }
}
