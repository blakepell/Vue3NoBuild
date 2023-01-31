using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Vue3NoBuild.Common
{
    /// <summary>
    /// General site extension methods.
    /// </summary>
    public static class Extensions
    {
        ///<summary>
        /// Adds a partial view script to the HttpContext to be rendered in the parent view.  This will allow
        /// a partial view to add items into the script section which it cannot normally do.
        /// </summary>
        public static IHtmlHelper Script(this IHtmlHelper htmlHelper, Func<object, HelperResult> template)
        {
            htmlHelper.ViewContext.HttpContext.Items[$"_script_{Guid.NewGuid()}"] = template;
            return null;
        }

        ///<summary>
        /// Renders any scripts used within the partial views.  This should be called on any layout page
        /// required either just before or just after the main script section.
        /// </summary>
        public static IHtmlHelper RenderPartialViewScripts(this IHtmlHelper htmlHelper)
        {
            foreach (object key in htmlHelper.ViewContext.HttpContext.Items.Keys)
            {
                if (key.ToString().StartsWith("_script_"))
                {
                    if (htmlHelper.ViewContext.HttpContext.Items[key] is Func<object, HelperResult> template)
                    {
                        htmlHelper.ViewContext.Writer.Write(template(null));
                    }
                }
            }
            return null;
        }

        /// <summary>
        /// If a request is an Ajax request.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="httpVerb"></param>
        public static bool IsAjax(this HttpRequest? request, string httpVerb = "")
        {
            if (request == null)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(httpVerb))
            {
                if (request.Method.ToLower() != httpVerb.ToLower())
                {
                    return false;
                }
            }

            return request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }
    }
}
