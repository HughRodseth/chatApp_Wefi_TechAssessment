using ServiceStack;

namespace ChatApp.Api.ServiceInterface.Services.Auth
{
    public class CustomUserSession : AuthUserSession
    {
        public long AppUserId { get; set; }
    }
}
