var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
    // Serve Angular in development
    var clientAppPath = Path.Combine(app.Environment.ContentRootPath, "ClientApp", "dist");
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
    var clientAppPath = Path.Combine(app.Environment.ContentRootPath, "ClientApp", "dist");
    var fileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientAppPath);
    
    var defaultFilesOptions = new DefaultFilesOptions { FileProvider = fileProvider };
    app.UseDefaultFiles(defaultFilesOptions);
    
    var staticFileOptions = new StaticFileOptions { FileProvider = fileProvider };
    app.UseStaticFiles(staticFileOptions);
    
    app.MapFallbackToFile("index.html");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

