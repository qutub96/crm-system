namespace CRMSystem.API.DTOs
{
    public class OpportunityResponseDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal Value { get; set; }
        public string Stage { get; set; } = string.Empty;
        public DateTime ExpectedCloseDate { get; set; }
        public int ProbabilityPercentage { get; set; }
        public DateTime? CloseDate { get; set; }
    }
}