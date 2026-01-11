using ChatApp.Api.ServiceModel.Types;
using ServiceStack;
using System.Runtime.Serialization;

namespace ChatApp.Api.ServiceModel.Requests
{
    public class Messages
    {
        [Route("/messages", "GET")]
        [DataContract]
        public class QueryMessages : QueryDb<Message>
        {
            [DataMember]
            public long? ChannelId { get; set; }

            [DataMember]
            public long? UserId { get; set; }
        }

        [Route("/messages", "POST")]
        [DataContract]
        public class CreateMessage : ICreateDb<Message>, IReturn<Message>
        {
            [DataMember]
            public long ChannelId { get; set; }

            [DataMember]
            public long UserId { get; set; }

            [DataMember]
            public string Body { get; set; } = default!;

            [DataMember]
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            [DataMember]
            public DateTime EditedAt { get; set; } = DateTime.UtcNow;
        }

        [Route("/messages/{Id}", "PUT")]
        [DataContract]
        public class UpdateMessage : IUpdateDb<Message>, IReturn<Message>
        {
            [DataMember]
            public long Id { get; set; }

            [DataMember]
            public string? Body { get; set; }
        }

        [Route("/messages/{Id}", "DELETE")]
        [DataContract]
        public class DeleteMessage : IDeleteDb<Message>, IReturnVoid
        {
            [DataMember]
            public long Id { get; set; }

            [DataMember]
            public DateTime? DeletedAt { get; set; }
        }
    }
}
