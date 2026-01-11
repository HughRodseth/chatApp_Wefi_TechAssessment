using ChatApp.Api.ServiceModel.ReturnTypes;
using ServiceStack;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace ChatApp.Api.ServiceModel.Requests.Auth
{
    [Route("/register", "POST")]
    [DataContract]
    public class RegisterUser : IReturn<AuthResponse>
    {
        [DataMember]
        [Required]
        public string UserName { get; set; } = default!;

        [DataMember]
        public string? DisplayName { get; set; }

        [DataMember]
        [Required]
        public string Password { get; set; } = default!;
    }

    [Route("/login", "GET")]
    [DataContract]
    public class LoginRequest : IReturn<AuthResponse>
    {
        [DataMember]
        [Required]
        public string UserName { get; set; } = default!;

        [DataMember]
        [Required]
        public string Password { get; set; } = default!;
    }
}
