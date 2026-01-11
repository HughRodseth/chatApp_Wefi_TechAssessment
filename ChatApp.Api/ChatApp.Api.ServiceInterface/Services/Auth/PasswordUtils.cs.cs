using System.Security.Cryptography;
using System.Text;

namespace ChatApp.Api.ServiceInterface.Services.Auth;

public static class PasswordUtils
{
    public static string Hash(string password)
    {
        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public static bool Verify(string password, string storedHash)
    {
        return Hash(password) == storedHash;
    }
}