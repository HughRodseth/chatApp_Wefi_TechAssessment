using ServiceStack.DataAnnotations;

namespace ChatApp.Api.ServiceModel.Types
{
    [Alias("users")]
    public class User
    {
        [AutoIncrement]
        [PrimaryKey]
        public long Id { get; set; }

        [Required]
        [Index(Unique = true)]
        public string UserName { get; set; } = default!;

        public string DisplayName { get; set; } = default!;

        public string PasswordHash { get; set; } = default!;

        public DateTime CreatedAt { get; set; }
    }
}
