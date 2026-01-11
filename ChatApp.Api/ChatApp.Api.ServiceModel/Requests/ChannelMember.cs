using ChatApp.Api.ServiceModel.Types;
using ServiceStack;
using System.Runtime.Serialization;

namespace ChatApp.Api.ServiceModel.Requests
{
    [Route("/channel-members", "GET")]
    [DataContract]
    public class QueryChannelMembers : QueryDb<ChannelMember>
    {
        [DataMember] public long? ChannelId { get; set; }
        [DataMember] public long? UserId { get; set; }
    }

    [Route("/channel-members", "POST")]
    [DataContract]
    public class CreateChannelMember : ICreateDb<ChannelMember>, IReturn<ChannelMember>
    {
        [DataMember] public long ChannelId { get; set; }
        [DataMember] public long UserId { get; set; }
        [DataMember] public DateTime? JoinedAt { get; set; }
    }

    [Route("/channel-members/{Id}", "PUT")]
    [DataContract]
    public class UpdateChannelMember : IUpdateDb<ChannelMember>, IReturn<ChannelMember>
    {
        [DataMember] public long Id { get; set; }
        [DataMember] public long? ChannelId { get; set; }
        [DataMember] public long? UserId { get; set; }
        [DataMember] public DateTime? JoinedAt { get; set; }
    }

    [Route("/channel-members/{Id}", "DELETE")]
    [DataContract]
    public class DeleteChannelMember : IDeleteDb<ChannelMember>, IReturnVoid
    {
        [DataMember] public long Id { get; set; }
    }
}
