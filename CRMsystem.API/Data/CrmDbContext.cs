using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using CRMSystem.API.Models;

namespace CRMSystem.API.Data
{
    // Changed: DbContext -> IdentityDbContext<ApplicationUser>
    public class CrmDbContext : IdentityDbContext<ApplicationUser>
    {
        public CrmDbContext(DbContextOptions<CrmDbContext> options) : base(options) { }

        public DbSet<Customer> Customer { get; set; }
        public DbSet<Interaction> Interactions { get; set; }
        public DbSet<Opportunity> Opportunities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Customer Relation
            modelBuilder.Entity<Customer>()
                .HasMany(c => c.Opportunities)
                .WithOne(o => o.Customer)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ NEW — explicitly define decimal precision for money field
            modelBuilder.Entity<Opportunity>()
                .Property(o => o.Value)
                .HasColumnType("decimal(18,2)");

            // Indexes for performance
            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Status);

            modelBuilder.Entity<Opportunity>()
                .HasIndex(o => o.Stage);
        }
    }
}