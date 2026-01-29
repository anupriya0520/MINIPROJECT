using System.ComponentModel.DataAnnotations;
using CourseManagementSystem.Validators;

namespace OnlineCourseManagement.DTOs
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "Name is required")]
        [RegularExpression(@"^[a-zA-Z\s]{3,}$",
            ErrorMessage = "Name must be at least 3 letters and contain only alphabets")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [OfficialEmail] // ✅ Allowed domains only
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$",
            ErrorMessage = "Password must be at least 6 characters, include a number and a special character")]
        public string Password { get; set; }
    }

    public class UserLoginDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }


    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
