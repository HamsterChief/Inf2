using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace StarterKit.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/v1/Register")]
    public class RegisterController : Controller
    {

        private readonly string _connectionString = "Data Source=webdev.sqlite;";

        [HttpPost("Register")]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            var connection = new SqliteConnection(_connectionString);
            var query = "";
            return Ok("Registration successful.");
        }

        public class RegisterModel
        {
            public string Email { get; set; }
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}