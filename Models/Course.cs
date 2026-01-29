
namespace OnlineCourseManagement.Models
{
    public class Course
    {
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; }
        public string? VideoUrl { get; internal set; }
    }
}
