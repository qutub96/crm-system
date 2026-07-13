namespace CRMSystem.API.DTOs
{
    public class OpportunityCreateDto
    {
        public int CustomerId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal Value { get; set; }
        public string Stage { get; set; } = "New";
        public DateTime ExpectedCloseDate { get; set; }
        public int ProbabilityPercentage { get; set; } = 0;
    }
}