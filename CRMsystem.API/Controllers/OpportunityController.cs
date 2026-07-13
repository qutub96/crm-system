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
    public class OpportunityController : ControllerBase
    {
        private readonly IOpportunityRepository _opportunityRepository;

        public OpportunityController(IOpportunityRepository opportunityRepository)
        {
            _opportunityRepository = opportunityRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<OpportunityStandaloneDto>>> GetAll()
        {
            var opportunities = await _opportunityRepository.GetAllAsync();
            return Ok(opportunities.Select(OpportunityMapper.ToStandaloneDto).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OpportunityStandaloneDto>> GetById(int id)
        {
            var opportunity = await _opportunityRepository.GetByIdAsync(id);
            if (opportunity == null) return NotFound();
            return Ok(OpportunityMapper.ToStandaloneDto(opportunity));
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<List<OpportunityStandaloneDto>>> GetByCustomerId(int customerId)
        {
            var opportunities = await _opportunityRepository.GetByCustomerIdAsync(customerId);
            return Ok(opportunities.Select(OpportunityMapper.ToStandaloneDto).ToList());
        }

        [HttpGet("stage/{stage}")]
        public async Task<ActionResult<List<OpportunityStandaloneDto>>> GetByStage(string stage)
        {
            var opportunities = await _opportunityRepository.GetByStageAsync(stage);
            return Ok(opportunities.Select(OpportunityMapper.ToStandaloneDto).ToList());
        }

        [HttpPost]
        public async Task<ActionResult<OpportunityStandaloneDto>> Create(OpportunityCreateDto dto)
        {
            var opportunity = OpportunityMapper.ToEntity(dto);
            await _opportunityRepository.CreateAsync(opportunity);

            var responseDto = OpportunityMapper.ToStandaloneDto(opportunity);
            return CreatedAtAction(nameof(GetById), new { id = opportunity.Id }, responseDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, OpportunityCreateDto dto)
        {
            var existing = await _opportunityRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.CustomerId = dto.CustomerId;
            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.Value = dto.Value;
            existing.Stage = dto.Stage;
            existing.ExpectedCloseDate = dto.ExpectedCloseDate;
            existing.ProbabilityPercentage = dto.ProbabilityPercentage;

            await _opportunityRepository.UpdateAsync(existing);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _opportunityRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _opportunityRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}