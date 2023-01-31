using Newtonsoft.Json;
using Vue3NoBuild.Common;
using Vue3NoBuild.Models;

namespace Vue3NoBuild.Controllers
{
    [Route("cache")]
    public class CacheController : Controller
    {
        private readonly CacheProvider _cache;

        public CacheController(CacheProvider cache)
        {
            _cache = cache;
        }

        [HttpGet("manager")]
        public IActionResult CacheManager()
        {
            var vm = new BaseViewModel()
            {
                ShowPageTitle = true
            };

            return this.View(vm);
        }

        [HttpGet("server-cache-list")]
        public IActionResult ServerCacheList()
        {
            _cache.RefreshKeys();
            return new JsonResult(_cache.Keys.ToArray());
        }

        [HttpGet("server-cache-item")]
        public IActionResult CacheItem(string key)
        {
            object obj = _cache.Get<object>(key, () => "");

            if (obj == null)
            {
                return this.Ok("null");
            }

            // I know this should probably be a JsonResult
            return this.Ok(JsonConvert.SerializeObject(obj, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            }));
        }

        [HttpGet("delete-server-cache-item")]
        public IActionResult DeleteServerCacheItem(string key)
        {
            if (!string.IsNullOrWhiteSpace(key))
            {
                _cache.Remove(key);
            }

            return new JsonResult(_cache.Keys.ToArray());
        }
    }
}
