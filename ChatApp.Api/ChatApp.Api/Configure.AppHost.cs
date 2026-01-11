[assembly: HostingStartup(typeof(ChatApp.Api.AppHost))]
namespace ChatApp.Api;

public class AppHost() : AppHostBase("ChatApp.Api"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) =>
        {
        });

    public override void Configure()
    {
        SetConfig(new HostConfig
        {
            DebugMode = true,
        });

        Plugins.Add(new CorsFeature(
            allowOriginWhitelist: new[]
            {
            "http://localhost:5173"
            },
            allowedHeaders: "Content-Type,Authorization",
            allowedMethods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
            allowCredentials: true
        ));

        Plugins.Add(new AutoQueryFeature
        {
            MaxLimit = 1000,
            IncludeTotal = true
        });
    }
}