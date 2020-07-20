using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using MyProject.Authorization;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyProject.HelpDesks
{
    [AbpAuthorize(PermissionNames.Pages_HelpDesks)]
    public class HelpDesksAppService : AsyncCrudAppService<HelpDesk, HelpDeskDto, int, PagedAndSortedResultRequestDto, HelpDeskDto>
    {
        public HelpDesksAppService(IRepository<HelpDesk, int> repository) : base(repository)
        {
        }
    }
    //public class HelpDesksAppService : CrudAppService<HelpDesk, HelpDeskDto>
    //{
    //    public HelpDesksAppService(IRepository<HelpDesk, int> repository) : base(repository)
    //    {
    //    }
    //}
}
