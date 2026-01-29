using Microsoft.EntityFrameworkCore;
using OnlineCourseManagement.Models;
using System.Collections.Generic;

namespace OnlineCourseManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Course>()
                .Property(c => c.VideoUrl)
                .IsRequired(false);
        }


    }
}
