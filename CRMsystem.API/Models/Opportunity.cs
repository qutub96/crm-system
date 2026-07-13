namespace CRMSystem.API.Models
{
    public class Opportunity
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal Value { get; set; }
        public string? Stage { get; set; }
        public DateTime ExpectedCloseDate { get; set; }
        public int ProbabilityPercentage { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CloseDate { get; set; }


        //Foriegn Keys
        public virtual Customer? Customer { get; set; }

    }
}
