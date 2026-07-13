using CRMSystem.API.Models;
using CRMSystem.API.DTOs;

namespace CRMSystem.API.Mappers
{
    public static class OpportunityMapper
    {
        public static Opportunity ToEntity(OpportunityCreateDto dto)
        {
            return new Opportunity
            {
                CustomerId = dto.CustomerId,
                Title = dto.Title,
                Description = dto.Description,
                Value = dto.Value,
                Stage = dto.Stage,
                ExpectedCloseDate = dto.ExpectedCloseDate,
                ProbabilityPercentage = dto.ProbabilityPercentage,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static OpportunityStandaloneDto ToStandaloneDto(Opportunity opportunity)
        {
            return new OpportunityStandaloneDto
            {
                Id = opportunity.Id,
                CustomerId = opportunity.CustomerId,
                Title = opportunity.Title,
                Description = opportunity.Description,
                Value = opportunity.Value,
                Stage = opportunity.Stage,
                ExpectedCloseDate = opportunity.ExpectedCloseDate,
                ProbabilityPercentage = opportunity.ProbabilityPercentage,
                CloseDate = opportunity.CloseDate,
                CreatedAt = opportunity.CreatedAt
            };
        }
    }
}