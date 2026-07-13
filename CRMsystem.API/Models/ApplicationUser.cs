using Microsoft.AspNetCore.Identity;

namespace CRMSystem.API.Models
{
    // Extends Identity's built-in user with our own custom fields
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "SalesRep"; // e.g. "Admin", "SalesRep"
    }
}