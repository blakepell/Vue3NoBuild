using System.Diagnostics;
using Vue3NoBuild.Models;

namespace Vue3NoBuild.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return this.View(new BaseViewModel());
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return this.View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? this.HttpContext.TraceIdentifier });
        }

        [HttpPost("search")]
        public IActionResult Search(string q)
        {
            return this.View("/Views/Home/Search.cshtml", new GenericViewModel<string>()
            {
                ShowPageTitle = false,
                Data = q
            });
        }

        [HttpGet("/number-lookup")]
        public JsonResult NumberLookup()
        {
            var dict = new Dictionary<int, string>
            {
                { 1, "One" },
                { 2, "Two" },
                { 3, "Three" },
                { 4, "Four" },
                { 5, "Five" }
            };

            return new JsonResult(dict);
        }

    }
}