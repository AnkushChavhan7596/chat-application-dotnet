using ChatApplication.API.Models.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.API.Data
{
    public class AuthDbContext : IdentityDbContext<ApplicationUser>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //var readerRoleId = "844143f2-3b1e-4982-9973-4017b92ff093";
            //var writerRoleId = "523328d2-1653-4c3d-8c82-97d9e1332fa7";

            //// Create Reader and Writer Role
            //var roles = new List<IdentityRole>
            //{
            //    new IdentityRole()
            //    {
            //        Id = readerRoleId,
            //        Name = "Reader",
            //        NormalizedName = "READER",
            //    },
            //    new IdentityRole()
            //    {
            //        Id = writerRoleId,
            //        Name = "Writer",
            //        NormalizedName = "WRITER",
            //    }
            //};

            //// Seed the roles
            //builder.Entity<IdentityRole>().HasData(roles);

            //// Create an Admin User
            //var adminUserId = "2305c1ff-ddd5-4121-ad26-f3930db5c116";
            //var admin = new ApplicationUser()
            //{
            //    Id = adminUserId,
            //    UserName = "admin@gmail.com",
            //    Email = "admin@gmail.com",
            //    NormalizedEmail = "ADMIN@GMAIL.COM",
            //    NormalizedUserName = "ADMIN@GMAIL.COM",
            //    DisplayName = "Super Admin",
            //    Status = "online",
            //    ProfilePictureUrl = null,
            //    LastSeen = (DateTime?)null,
            //};

            //admin.PasswordHash = "AQAAAAIAAYagAAAAEAFFc1qx8QqZ2asE670ZXlXKhfR6ShvRxt+A0VlQpX00L9rpZXWch1yQWvhqaoqg9g==";

            //builder.Entity<ApplicationUser>().HasData(admin);

            //// Give Roles to Admin
            //var adminRoles = new List<IdentityUserRole<string>> {
            //    new()
            //    {
            //        UserId = adminUserId,
            //        RoleId = readerRoleId
            //    },
            //    new()
            //    {
            //        UserId = adminUserId,
            //        RoleId = writerRoleId
            //    }
            //};

            //builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);
        }
    }
}
