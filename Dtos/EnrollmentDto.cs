using System.ComponentModel.DataAnnotations;

namespace OnlineCourseManagement.DTOs
{
    public class EnrollmentDto
    {
        public int CourseId { get; set; }
    }
    public class EnrollmentResponseDto
    {
        public int EnrollmentId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        [Required(ErrorMessage = "CourseId is required")]
        public int CourseId { get; set; }
        public string CourseTitle { get; set; }
        public string CourseDescription { get; set; }
        public decimal CoursePrice { get; set; }
        public string VideoUrl { get; set; }
        public DateTime EnrolledDate { get; set; }
    }
}
