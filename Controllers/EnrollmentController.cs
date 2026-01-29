using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineCourseManagement.DTOs;
using OnlineCourseManagement.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OnlineCourseManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        // ====================
        // User-only endpoints
        // ====================
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetEnrollments()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? userId = userIdClaim != null ? int.Parse(userIdClaim) : (int?)null;

            var enrollments = await _enrollmentService.GetEnrollments(userId);
            return Ok(enrollments);
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> Enroll(EnrollmentDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token");

            int userId = int.Parse(userIdClaim);
            var result = await _enrollmentService.Enroll(userId, dto);
            return Ok(result);
        }

        // ====================
        // Admin-only endpoint
        // ====================
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllEnrollments()
        {
            // Admin can view all enrollments
            var enrollments = await _enrollmentService.GetEnrollments(); // no userId filter
            return Ok(enrollments);
        }
    }
}
