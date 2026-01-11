using ChatApp.Api.ServiceModel;
using ServiceStack;
using ServiceStack.OrmLite;

namespace ChatApp.Api.ServiceInterface;

public class MyServices : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}!" };
    }

    public async Task<object> AnyAsync()
    {
        var test = await Db.SingleAsync<Hello>(x => x.Name == "Test");
        return test;
    }
}