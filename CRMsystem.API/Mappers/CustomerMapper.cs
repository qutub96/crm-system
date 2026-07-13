using CRMSystem.API.Models;
using CRMSystem.API.DTOs;

namespace CRMSystem.API.Mappers
{
    public static class CustomerMapper
    {
        // Convert INPUT dto -> Entity (used before saving to database)
        public static Customer ToEntity(CustomerCreateDto dto)
        {
            return new Customer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Company = dto.Company,
                Industry = dto.Industry,
                Status = dto.Status,
                CreateAt = DateTime.UtcNow   // ← server decides this, not the client
            };
        }

        // Convert Entity -> OUTPUT dto (used after fetching from database)
        public static CustomerResponseDto ToResponseDto(Customer customer)
        {
            return new CustomerResponseDto
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                Company = customer.Company,
                Industry = customer.Industry,
                Status = customer.Status,
                CreatedAt = customer.CreateAt
            };
        }

        // Convert Entity -> WithHistory dto (includes nested interactions/opportunities)
        public static CustomerWithHistoryDto ToWithHistoryDto(Customer customer)
        {
            return new CustomerWithHistoryDto
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                Status = customer.Status,
                Interactions = customer.Interactions.Select(i => new InteractionResponseDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Type = i.Type,
                    Subject = i.Subject,
                    Notes = i.Notes,
                    InteractionDate = i.InteractionDate,
                    Status = i.Status
                }).ToList(),
                Opportunities = customer.Opportunities.Select(o => new OpportunityResponseDto
                {
                    Id = o.Id,
                    Title = o.Title,
                    Description = o.Description,
                    Value = o.Value,
                    Stage = o.Stage,
                    ExpectedCloseDate = o.ExpectedCloseDate,
                    ProbabilityPercentage = o.ProbabilityPercentage,
                    CloseDate = o.CloseDate
                }).ToList()
            };
        }
    }
}