using ServiceStack.DataAnnotations;

namespace ChatApp.Api.ServiceModel.Types
{
    [Alias("channel_members")]
    public class ChannelMember
    {
        [AutoIncrement]
        [PrimaryKey]
        public long Id { get; set; }

        [ForeignKey(typeof(Channel))]
        public long ChannelId { get; set; }

        [ForeignKey(typeof(User))]
        public long UserId { get; set; }

        public DateTime JoinedAt { get; set; }
    }
}
