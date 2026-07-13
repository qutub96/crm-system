using CRMSystem.API.Models;

namespace CRMSystem.API.Models
{
    public class Interaction
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Subject { get; set; }
        public string? Notes { get; set; }
        public DateTime InteractionDate { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public virtual Customer? Customer { get; set; }
    }
}