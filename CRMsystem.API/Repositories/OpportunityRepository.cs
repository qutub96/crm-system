using Microsoft.EntityFrameworkCore;
using CRMSystem.API.Data;
using CRMSystem.API.Models;

namespace CRMSystem.API.Repositories
{
    public interface IOpportunityRepository : IGenericRepository<Opportunity>
    {
        Task<List<Opportunity>> GetByCustomerIdAsync(int customerId);
        Task<List<Opportunity>> GetByStageAsync(string stage);
    }

    public class OpportunityRepository : GenericRepository<Opportunity>, IOpportunityRepository
    {
        public OpportunityRepository(CrmDbContext context) : base(context) { }

        public async Task<List<Opportunity>> GetByCustomerIdAsync(int customerId)
        {
            return await _dbSet.Where(o => o.CustomerId == customerId).ToListAsync();
        }

        public async Task<List<Opportunity>> GetByStageAsync(string stage)
        {
            return await _dbSet.Where(o => o.Stage == stage).ToListAsync();
        }
    }
}