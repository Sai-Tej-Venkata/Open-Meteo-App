using Weather_App.Interfaces;
using Weather_App.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS policy - Allow requests from localhost Angular app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
              .DisallowCredentials();
    });
});

// Add HttpClient and services for dependency injection
builder.Services.AddHttpClient<IHttpService, HttpService>();
builder.Services.AddScoped<IOpenMeteoClientService, OpenMeteoClientService>();

var app = builder.Build();

// Log all registered routes in development
if (app.Environment.IsDevelopment())
{
    Console.WriteLine("=== Registered Routes ===");
    foreach (var endpoint in app.Services.GetService<IEnumerable<EndpointDataSource>>()?.FirstOrDefault()?.Endpoints ?? Enumerable.Empty<Endpoint>())
    {
        Console.WriteLine(endpoint.DisplayName);
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
    // Serve Angular in development
    var clientAppPath = Path.Combine(app.Environment.ContentRootPath, "AppAngular", "dist");
    if (Directory.Exists(clientAppPath))
    {
        var fileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientAppPath);
        var defaultFilesOptions = new DefaultFilesOptions { FileProvider = fileProvider };
        app.UseDefaultFiles(defaultFilesOptions);
        
        var staticFileOptions = new StaticFileOptions { FileProvider = fileProvider };
        app.UseStaticFiles(staticFileOptions);
        
        app.MapFallbackToFile("index.html");
    }
}
else
{
    // Serve the Angular client in production
    var clientAppPath = Path.Combine(app.Environment.ContentRootPath, "AppAngular", "dist");
    var fileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientAppPath);
    
    var defaultFilesOptions = new DefaultFilesOptions { FileProvider = fileProvider };
    app.UseDefaultFiles(defaultFilesOptions);
    
    var staticFileOptions = new StaticFileOptions { FileProvider = fileProvider };
    app.UseStaticFiles(staticFileOptions);
    
    app.MapFallbackToFile("index.html");
}

// IMPORTANT: Apply middleware in correct order
app.UseHttpsRedirection();

// Apply CORS policy BEFORE authorization
app.UseCors("AllowAll");

app.UseAuthorization();

// Map controllers
app.MapControllers();

// Add a diagnostic endpoint
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }))
    .AllowAnonymous();

app.Run();


