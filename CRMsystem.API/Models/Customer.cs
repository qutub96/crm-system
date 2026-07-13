using Microsoft.VisualBasic;
namespace CRMSystem.API.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Company { get; set; }
        public string? Industry { get; set; }
        public string? Status { get; set; }  //Active , Inactive , prospect
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public  DateTime LastInteractionDate {  get; set; }


        //Foriegn keys

        public virtual ICollection<Interaction> Interactions { get; set; } = new List<Interaction>();
        public virtual ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();



    }
}
