using CRMSystem.API.Models;
using CRMSystem.API.DTOs;

namespace CRMSystem.API.Mappers
{
    public static class InteractionMapper
    {
        // DTO -> Entity (for POST/PUT)
        public static Interaction ToEntity(InteractionCreateDto dto)
        {
            return new Interaction
            {
                CustomerId = dto.CustomerId,
                Name = dto.Name,
                Type = dto.Type,
                Subject = dto.Subject,
                Notes = dto.Notes,
                InteractionDate = dto.InteractionDate,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };
        }

        // Entity -> Standalone DTO (for GET endpoints returning Interaction on its own)
        public static InteractionStandaloneDto ToStandaloneDto(Interaction interaction)
        {
            return new InteractionStandaloneDto
            {
                Id = interaction.Id,
                CustomerId = interaction.CustomerId,
                Name = interaction.Name,
                Type = interaction.Type,
                Subject = interaction.Subject,
                Notes = interaction.Notes,
                InteractionDate = interaction.InteractionDate,
                Status = interaction.Status,
                CreatedAt = interaction.CreatedAt
            };
        }
    }
}