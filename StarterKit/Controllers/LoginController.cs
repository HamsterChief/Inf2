using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;

namespace StarterKit.Controllers;


[Route("api/v1")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;
    private string AUTH_SESSION_KEY = "admin_login";

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("login/admin")]
    public IActionResult LoginAdmin([FromBody] LoginBody loginBody)
    {
        if (!string.IsNullOrEmpty(HttpContext.Session.GetString(AUTH_SESSION_KEY)))
        {
            return Ok(new { message = "You are already logged in" });
        }

        if (string.IsNullOrEmpty(loginBody.Username) || string.IsNullOrEmpty(loginBody.Password)){
            return BadRequest(new { message = "Username and password are a must." });
        }

        var loginstatus = _loginService.CheckPassword(loginBody.Username, loginBody.Password);

        if (loginstatus == LoginStatus.Success){
            HttpContext.Session.SetString(AUTH_SESSION_KEY, loginBody.Username);
            return Ok(new { message = "Successfully logged in as an admin." });
        }

        HttpContext.Session.Remove(AUTH_SESSION_KEY);
        return Unauthorized(new { message = "Incorrect password or username" });
    }

    [HttpGet("login/check")]
    public IActionResult Check()
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

    [HttpGet("logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Remove(AUTH_SESSION_KEY);
        return Ok("Logged out");
    }

    [HttpGet("login/clear-session")]
    public IActionResult ClearSession()
    {
        // Verwijder de sessie als deze bestaat
        HttpContext.Session.Remove(AUTH_SESSION_KEY);
        return Ok("Session cleared");
    }
}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}