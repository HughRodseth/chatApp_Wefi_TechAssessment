using ChatApp.Api.ServiceModel.Types;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace ChatApp.Api.Migrations;

[Description("Initial Migation To Add User, Channel, ChannelMember and Message tables to the database.")]
public class Migration20260109a_InitialMigration : MigrationBase
{
    public override void Up()
    {
        Db.CreateTable<User>();
        Db.CreateTable<Channel>();
        Db.CreateTable<ChannelMember>();
        Db.CreateTable<Message>();
    }

    public override void Down()
    {
        Db.DropTable<User>();
        Db.DropTable<Channel>();
        Db.DropTable<ChannelMember>();
        Db.DropTable<Message>();
    }
}
