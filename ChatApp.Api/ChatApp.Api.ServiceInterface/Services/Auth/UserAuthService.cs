using ChatApp.Api.ServiceModel.Requests.Auth;
using ChatApp.Api.ServiceModel.ReturnTypes;
using ChatApp.Api.ServiceModel.Types;
using ServiceStack;
using ServiceStack.OrmLite;

namespace ChatApp.Api.ServiceInterface.Services.Auth
{
    public class UserAuthService : Service
    {
        public async Task<object> AnyAsync(RegisterUser request)
        {
            var exists = await base.Db.SingleAsync((User u) => u.UserName == request.UserName);
            if (exists != null)
                throw HttpError.Conflict("Username already exists");

            var user = new User
            {
                UserName = request.UserName,
                DisplayName = request.DisplayName ?? request.UserName,
                PasswordHash = PasswordUtils.Hash(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            await Db.SaveAsync(user);

            return new AuthResponse
            {
                UserId = user.Id,
                UserName = user.UserName,
                DisplayName = user.DisplayName
            };
        }

        public async Task<object> AnyAsync(LoginRequest request)
        {
            var user = await base.Db.SingleAsync<User>(u => u.UserName == request.UserName);
            if (user == null)
            {
                throw HttpError.Unauthorized("Invalid username or password");
            }
            if (!PasswordUtils.Verify(request.Password, user.PasswordHash))
            {
                throw HttpError.Unauthorized("Invalid username or password");
            }

            var session = GetSession() as CustomUserSession ?? new CustomUserSession();

            session.IsAuthenticated = true;
            session.AppUserId = user.Id;
            session.UserAuthName = user.UserName;

            await this.SaveSessionAsync(session);

            return new AuthResponse
            {
                UserId = user.Id,
                UserName = user.UserName,
                DisplayName = user.DisplayName
            };
        }
    }
}
