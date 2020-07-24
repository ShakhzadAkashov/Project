using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyProject.HelpDesks.Dto
{
    [AutoMapTo(typeof(HelpDesk))]
    public class CreateHelpDeskDto
    {
        public string Name { get; set; }
        public string SurName { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
    }
}
