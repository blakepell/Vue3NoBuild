namespace Vue3NoBuild.Models
{
    public class GenericViewModel<T> : BaseViewModel
    {
        public T? Data { get; set; }
    }
}