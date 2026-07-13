using Microsoft.EntityFrameworkCore;
using CRMSystem.API.Data;
using CRMSystem.API.Models;

namespace CRMSystem.API.Repositories
{
    public interface IInteractionRepository : IGenericRepository<Interaction>
    {
        Task<List<Interaction>> GetByCustomerIdAsync(int customerId);
        Task<List<Interaction>> GetPendingAsync();
    }

    public class InteractionRepository : GenericRepository<Interaction>, IInteractionRepository
    {
        public InteractionRepository(CrmDbContext context) : base(context) { }

        public async Task<List<Interaction>> GetByCustomerIdAsync(int customerId)
        {
            return await _dbSet
                .Where(i => i.CustomerId == customerId)
                .OrderByDescending(i => i.InteractionDate)
                .ToListAsync();
        }

        public async Task<List<Interaction>> GetPendingAsync()
        {
            return await _dbSet
                .Where(i => i.Status == "Pending")
                .OrderBy(i => i.InteractionDate)
                .ToListAsync();
        }
    }
}