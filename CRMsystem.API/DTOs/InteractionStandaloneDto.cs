namespace CRMSystem.API.DTOs
{
    // Used when Interaction is returned on its own (not nested inside a Customer)
    public class InteractionStandaloneDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime InteractionDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}