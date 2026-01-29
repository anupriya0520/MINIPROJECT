using System.Collections.Generic;

namespace OnlineCourseManagement.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User";
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
