using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace MyProject.HelpDesks
{
    [AutoMapFrom(typeof(HelpDesk))]
    public class HelpDeskDto : EntityDto<int>
    {
        public string Name { get; set; }
        public string SurName { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
    }
}
