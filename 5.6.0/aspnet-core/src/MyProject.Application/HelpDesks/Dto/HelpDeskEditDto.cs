using System;
using System.Collections.Generic;
using System.Text;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;
using Abp.Authorization.Roles;
using MyProject.Authorization.Roles;
using Abp.AutoMapper;

namespace MyProject.HelpDesks.Dto
{
    [AutoMapFrom(typeof(HelpDesk))]
    public class HelpDeskEditDto : EntityDto<int>
    {
        public string Name { get; set; }
        public string SurName { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
    }
}
