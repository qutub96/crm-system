using Microsoft.AspNetCore.Mvc;
using CRMSystem.API.Models;
using CRMSystem.API.Repositories;
using CRMSystem.API.DTOs;
using CRMSystem.API.Mappers;
using Microsoft.AspNetCore.Authorization;

namespace CRMSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InteractionController : ControllerBase
    {
        private readonly IInteractionRepository _interactionRepository;

        public InteractionController(IInteractionRepository interactionRepository)
        {
            _interactionRepository = interactionRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<InteractionStandaloneDto>>> GetAll()
        {
            var interactions = await _interactionRepository.GetAllAsync();
            return Ok(interactions.Select(InteractionMapper.ToStandaloneDto).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InteractionStandaloneDto>> GetById(int id)
        {
            var interaction = await _interactionRepository.GetByIdAsync(id);
            if (interaction == null) return NotFound();
            return Ok(InteractionMapper.ToStandaloneDto(interaction));
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<List<InteractionStandaloneDto>>> GetByCustomerId(int customerId)
        {
            var interactions = await _interactionRepository.GetByCustomerIdAsync(customerId);
            return Ok(interactions.Select(InteractionMapper.ToStandaloneDto).ToList());
        }

        [HttpGet("pending")]
        public async Task<ActionResult<List<InteractionStandaloneDto>>> GetPending()
        {
            var interactions = await _interactionRepository.GetPendingAsync();
            return Ok(interactions.Select(InteractionMapper.ToStandaloneDto).ToList());
        }

        [HttpPost]
        public async Task<ActionResult<InteractionStandaloneDto>> Create(InteractionCreateDto dto)
        {
            var interaction = InteractionMapper.ToEntity(dto);
            await _interactionRepository.CreateAsync(interaction);

            var responseDto = InteractionMapper.ToStandaloneDto(interaction);
            return CreatedAtAction(nameof(GetById), new { id = interaction.Id }, responseDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, InteractionCreateDto dto)
        {
            var existing = await _interactionRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.CustomerId = dto.CustomerId;
            existing.Name = dto.Name;
            existing.Type = dto.Type;
            existing.Subject = dto.Subject;
            existing.Notes = dto.Notes;
            existing.InteractionDate = dto.InteractionDate;
            existing.Status = dto.Status;

            await _interactionRepository.UpdateAsync(existing);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _interactionRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _interactionRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}