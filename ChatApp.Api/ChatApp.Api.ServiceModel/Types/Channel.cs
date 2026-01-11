using ServiceStack.DataAnnotations;

namespace ChatApp.Api.ServiceModel.Types
{
    [Alias("channels")]
    public class Channel
    {
        [AutoIncrement]
        [PrimaryKey]
        public long Id { get; set; }

        [Required]
        [Index(Unique = true)]
        public string Name { get; set; } = default!;

        [References(typeof(User))]
        public long CreatedByUserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Reference]
        public User User { get; set; }
    }
}
