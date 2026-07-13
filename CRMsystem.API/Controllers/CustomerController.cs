using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CRMSystem.API.Models;
using CRMSystem.API.Repositories;
using CRMSystem.API.DTOs;
using CRMSystem.API.Mappers;

namespace CRMSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]   // ✅ every endpoint below now requires a valid token
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerController(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        // GET: api/customer
        [HttpGet]
        public async Task<ActionResult<List<CustomerResponseDto>>> GetAll()
        {
            var customers = await _customerRepository.GetAllAsync();
            var result = customers.Select(CustomerMapper.ToResponseDto).ToList();
            return Ok(result);
        }

        // GET: api/customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerResponseDto>> GetById(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            if (customer == null) return NotFound();
            return Ok(CustomerMapper.ToResponseDto(customer));
        }

        // GET: api/customer/email/test@example.com
        [HttpGet("email/{email}")]
        public async Task<ActionResult<CustomerResponseDto>> GetByEmail(string email)
        {
            var customer = await _customerRepository.GetByEmailAsync(email);
            if (customer == null) return NotFound();
            return Ok(CustomerMapper.ToResponseDto(customer));
        }

        // GET: api/customer/status/Active
        [HttpGet("status/{status}")]
        public async Task<ActionResult<List<CustomerResponseDto>>> GetByStatus(string status)
        {
            var customers = await _customerRepository.GetByStatusAsync(status);
            var result = customers.Select(CustomerMapper.ToResponseDto).ToList();
            return Ok(result);
        }

        // GET: api/customer/with-history
        [HttpGet("with-history")]
        public async Task<ActionResult<List<CustomerWithHistoryDto>>> GetWithHistory()
        {
            var customers = await _customerRepository.GetWithHistoryAsync();
            var result = customers.Select(CustomerMapper.ToWithHistoryDto).ToList();
            return Ok(result);
        }

        // POST: api/customer
        [HttpPost]
        public async Task<ActionResult<CustomerResponseDto>> Create(CustomerCreateDto dto)
        {
            var customer = CustomerMapper.ToEntity(dto);
            await _customerRepository.CreateAsync(customer);

            var responseDto = CustomerMapper.ToResponseDto(customer);
            return CreatedAtAction(nameof(GetById), new { id = customer.Id }, responseDto);
        }

        // PUT: api/customer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CustomerCreateDto dto)
        {
            var existing = await _customerRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.FirstName = dto.FirstName;
            existing.LastName = dto.LastName;
            existing.Email = dto.Email;
            existing.PhoneNumber = dto.PhoneNumber;
            existing.Company = dto.Company;
            existing.Industry = dto.Industry;
            existing.Status = dto.Status;

            await _customerRepository.UpdateAsync(existing);
            return NoContent();
        }

        // DELETE: api/customer/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]   // ✅ only Admins can delete customers
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _customerRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _customerRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}