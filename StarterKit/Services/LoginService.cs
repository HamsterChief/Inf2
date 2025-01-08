using Microsoft.Data.Sqlite;
using StarterKit.Models;
using StarterKit.Utils;

namespace StarterKit.Services;

public enum LoginStatus { IncorrectPassword, IncorrectUsername, Success }

public enum ADMIN_SESSION_KEY { adminLoggedIn }

public class LoginService : ILoginService
{

    private readonly DatabaseContext _context;
    private readonly string _connectionString = "Data Source=webdev.sqlite;";


    public LoginService(DatabaseContext context)
    {
        _context = context;
    }

    public LoginStatus CheckPassword(string username, string inputPassword)
    {
        // TODO: Make this method check the password with what is in the database
        try
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                string query = "SELECT Password FROM Admin WHERE UserName = @username COLLATE BINARY";
                using (var command = new SqliteCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@username", username);

                    var result = command.ExecuteScalar();
                    if (result == null)
                    {
                        return LoginStatus.IncorrectUsername;
                    }

                    if (result.ToString() == EncryptionHelper.EncryptPassword(inputPassword))
                    {
                        Console.WriteLine($"Password match for username: {username}");
                        return LoginStatus.Success;
                    }
                    else
                    {
                        return LoginStatus.IncorrectPassword;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // Log or handle the exception
            Console.WriteLine("Error: " + ex.Message);
            return LoginStatus.IncorrectUsername;
        }
    }
}