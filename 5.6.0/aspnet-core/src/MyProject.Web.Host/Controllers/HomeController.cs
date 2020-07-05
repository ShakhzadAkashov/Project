using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp;
using Abp.Extensions;
using Abp.Notifications;
using Abp.Timing;
using Abp.Web.Security.AntiForgery;
using MyProject.Controllers;
using MyProject.Problems;
using MyProject.EntityFrameworkCore.Repositories;

namespace MyProject.Web.Host.Controllers
{
    public class HomeController : MyProjectControllerBase
    {
        private readonly INotificationPublisher _notificationPublisher;
        private IProblemRepository repository;
        public HomeController(INotificationPublisher notificationPublisher, IProblemRepository repo)
        {
            _notificationPublisher = notificationPublisher;
            repository = repo;
        }

        public ViewResult Index() => View();
        public ViewResult Create() => View();
        [HttpPost]
        public IActionResult Create(Problem problem)
        {
            repository.SaveProblem(problem);
            return RedirectToAction("Index");
        }

        //public IActionResult Index()
        //{
        //    return Redirect("/swagger");
        //}

        /// <summary>
        /// This is a demo code to demonstrate sending notification to default tenant admin and host admin uers.
        /// Don't use this code in production !!!
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task<ActionResult> TestNotification(string message = "")
        {
            if (message.IsNullOrEmpty())
            {
                message = "This is a test notification, created at " + Clock.Now;
            }

            var defaultTenantAdmin = new UserIdentifier(1, 2);
            var hostAdmin = new UserIdentifier(null, 1);

            await _notificationPublisher.PublishAsync(
                "App.SimpleMessage",
                new MessageNotificationData(message),
                severity: NotificationSeverity.Info,
                userIds: new[] { defaultTenantAdmin, hostAdmin }
            );

            return Content("Sent notification: " + message);
        }
    }
}
