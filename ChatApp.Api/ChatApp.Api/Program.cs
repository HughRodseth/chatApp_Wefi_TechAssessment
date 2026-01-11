using ChatApp.Api.ServiceInterface;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServiceStack(typeof(MyServices).Assembly);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

builder.WebHost.UseUrls("http://localhost:5001");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseCors("AllowFrontend");

app.UseServiceStack(new AppHost(), options =>
{
    options.MapEndpoints();
});

app.Run();
