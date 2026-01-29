using OnlineCourseManagement.DTOs;
using OnlineCourseManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

using System.Threading.Tasks;

namespace OnlineCourseManagement.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> Register(UserRegisterDto dto);
        Task<(string Token, string Role)> Login(UserLoginDto dto);
        Task<List<User>> GetAllUsers();
    }
}
