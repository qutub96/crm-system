namespace CRMSystem.API.DTOs
{
    // Used ONLY for the with-history endpoint
    public class CustomerWithHistoryDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<InteractionResponseDto> Interactions { get; set; } = new();
        public List<OpportunityResponseDto> Opportunities { get; set; } = new();
    }
}