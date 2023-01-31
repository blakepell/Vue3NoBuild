using Newtonsoft.Json;
using Vue3NoBuild.Common;

namespace Vue3NoBuild
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews()
                            .AddRazorRuntimeCompilation();

            // Add framework services.
            builder.Services
                .AddHttpsRedirection(options => options.HttpsPort = 443)
                .AddMemoryCache()
                .AddLogging()
                .AddResponseCompression(options => { options.EnableForHttps = true; })
                .AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN")
                .AddControllersWithViews(options =>
                    options.RespectBrowserAcceptHeader = true
                )
                .AddNewtonsoftJson(options =>
                {
                    // Do not auto camelCase serialized/JSON models: http://stackoverflow.com/a/38144892/120783
                    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });

            builder.Services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
            });

            builder.Host
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    config.SetBasePath(hostingContext.HostingEnvironment.ContentRootPath)
                        .AddJsonFile("appsettings.json", optional: true);
                });

            // Custom IUF services.
            builder.Services
                .AddTransient<CacheProvider>()
                .AddSingleton<IActionContextAccessor, ActionContextAccessor>()
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Only for the example.
            builder.Services.AddSingleton(new AppSettings());

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors();
            app.UseStaticFiles();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}