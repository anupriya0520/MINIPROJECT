using OnlineCourseManagement.DTOs;
using System.Threading.Tasks;

namespace OnlineCourseManagement.Interfaces
{
    public interface IEnrollmentService
    {
        Task<EnrollmentDto> Enroll(int UserId, EnrollmentDto dto);
        Task<IEnumerable<EnrollmentResponseDto>> GetEnrollments(int? userId = null);
    }
}
