using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;

namespace StarterKit.Controllers;


[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;
    

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginBody loginBody)
    {
        // TODO: Impelement login method
        if (string.IsNullOrEmpty(loginBody.Username) || string.IsNullOrEmpty(loginBody.Password)){
            return BadRequest("username and password are a must.");
        } 

        var loginstatus = _loginService.CheckPassword(loginBody.Username, loginBody.Password);

        if (loginstatus == LoginStatus.Success){
            return Ok("Succesfully logged in.");
        }
        return Unauthorized("Incorrect password");
    }

    [HttpPost("/login/admin")]
    public IActionResult LoginAdmin([FromForm] string username, [FromForm] string password){

        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password)){
            return BadRequest("username and password are a must.");
        }

        var loginstatus = _loginService.CheckPassword(username, password);

        if (loginstatus == LoginStatus.IncorrectPassword){
            return Unauthorized("Incorrect password"); 
        }

        return Ok("Succesfully logged in as an admin.");
        
    }


    [HttpGet("IsAdminLoggedIn")]
    public IActionResult IsAdminLoggedIn()   
    {
        // TODO: This method should return a status 200 OK when logged in, else 403, unauthorized
        
        return Unauthorized("You are not logged in");
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
