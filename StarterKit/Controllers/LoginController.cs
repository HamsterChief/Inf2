using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;

namespace StarterKit.Controllers;


[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;
    private string AUTH_SESSION_KEY = "admin_login";

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("login/admin")]
    public IActionResult LoginAdmin([FromBody] LoginBody loginBody){

        if (string.IsNullOrEmpty(loginBody.Username) || string.IsNullOrEmpty(loginBody.Password)){
            return BadRequest("username and password are a must.");
        }

        var loginstatus = _loginService.CheckPassword(loginBody.Username, loginBody.Password);

        if (loginstatus == LoginStatus.Success){
            HttpContext.Session.SetString(AUTH_SESSION_KEY, loginBody.Username);
            return Ok("Succesfully logged in as an admin.");
        }

        return Unauthorized("Incorrect password"); 
        
    }


    [HttpGet("IsAdminLoggedIn")]
    public IActionResult IsAdminLoggedIn()
    {
        string? adminUserName = HttpContext.Session.GetString(AUTH_SESSION_KEY);
        if (!string.IsNullOrEmpty(adminUserName))
        {
            return Ok(new
            {
                isLoggedIn = true,
                adminUser = adminUserName
            });
        }
        return Unauthorized(new
        {
            isLoggedIn = false,
            adminUser = (string)null!
        });
    }

    [HttpGet("Logout")]
    public IActionResult Logout()
    {
        return Ok("Logged out");
    }

}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
