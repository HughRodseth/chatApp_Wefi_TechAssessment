using System.Runtime.Serialization;

namespace ChatApp.Api.ServiceModel.ReturnTypes
{
    [DataContract]
    public class AuthResponse
    {
        [DataMember]
        public long UserId { get; set; }

        [DataMember]
        public string UserName { get; set; } = default!;

        [DataMember]
        public string DisplayName { get; set; } = default!;
    }
}
