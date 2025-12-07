using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApplication.API.Migrations
{
    /// <inheritdoc />
    public partial class UnreadCountfieldadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UnreadCount",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnreadCount",
                table: "AspNetUsers");
        }
    }
}
