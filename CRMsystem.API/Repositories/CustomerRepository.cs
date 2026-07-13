using Microsoft.EntityFrameworkCore;
using CRMSystem.API.Data;
using CRMSystem.API.Models;

namespace CRMSystem.API.Repositories
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        Task<Customer?> GetByEmailAsync(string email);
        Task<List<Customer>> GetByStatusAsync(string status);
        Task<List<Customer>> GetWithHistoryAsync();
    }

    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(CrmDbContext context) : base(context) { }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<List<Customer>> GetByStatusAsync(string status)
        {
            return await _dbSet.Where(c => c.Status == status).ToListAsync();
        }

        public async Task<List<Customer>> GetWithHistoryAsync()
        {
            return await _dbSet
                .Include(c => c.Interactions)
                .Include(c => c.Opportunities)
                .ToListAsync();
        }
    }
}