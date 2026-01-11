using ServiceStack.DataAnnotations;

namespace ChatApp.Api.ServiceModel.Types
{
    [Alias("messages")]
    public class Message
    {
        [AutoIncrement]
        [PrimaryKey]
        public long Id { get; set; }

        [ForeignKey(typeof(Channel))]
        public long ChannelId { get; set; }

        [ForeignKey(typeof(User))]
        public long UserId { get; set; }

        [Required]
        [StringLength(int.MaxValue)]
        public string Body { get; set; } = default!;

        [Index]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? EditedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeletedAt { get; set; }

        [Reference]
        public User User { get; set; }
    }
}
