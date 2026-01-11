using ChatApp.Api.ServiceModel.Types;
using ServiceStack;
using System.Runtime.Serialization;

namespace ChatApp.Api.ServiceModel.Requests
{
    [Route("/channels", "GET")]
    [DataContract]
    public class QueryChannels : QueryDb<Channel>
    {
        [DataMember] public long? Id { get; set; }
        [DataMember] public string? Name { get; set; }
    }

    [Route("/channels", "POST")]
    [DataContract]
    public class CreateChannel : ICreateDb<Channel>, IReturn<Channel>
    {
        [DataMember] public string Name { get; set; } = default!;
        [DataMember] public long CreatedByUserId { get; set; }
        [DataMember] public DateTime? CreatedAt { get; set; }
    }

    [Route("/channels/{Id}", "PUT")]
    [DataContract]
    public class UpdateChannel : IUpdateDb<Channel>, IReturn<Channel>
    {
        [DataMember] public long Id { get; set; }
        [DataMember] public string? Name { get; set; }
    }

    [Route("/channels/{Id}", "DELETE")]
    [DataContract]
    public class DeleteChannel : IDeleteDb<Channel>, IReturnVoid
    {
        [DataMember] public long Id { get; set; }
    }
}
