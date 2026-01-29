using OnlineCourseManagement.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlineCourseManagement.Interfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllCourses();
        Task<CourseDto> GetCourse(int id);
        Task<CourseDto> CreateCourse(CourseDto dto);
        Task<CourseDto> UpdateCourse(int id, CourseDto dto);
        Task<bool> DeleteCourse(int id);
    }
}
