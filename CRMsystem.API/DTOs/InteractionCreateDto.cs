namespace CRMSystem.API.DTOs
{
    public class InteractionCreateDto
    {
        public int CustomerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime InteractionDate { get; set; }
        public string Status { get; set; } = "Pending";
    }
}