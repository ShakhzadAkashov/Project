using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using MyProject.Authorization;
using System;
using System.Collections.Generic;
using System.Text;
using MyProject.HelpDesks.Dto;
using System.Threading.Tasks;

namespace MyProject.HelpDesks
{
    [AbpAuthorize(PermissionNames.Pages_HelpDesks)]
    public class HelpDesksAppService : AsyncCrudAppService<HelpDesk, HelpDeskDto, int, PagedAndSortedResultRequestDto, CreateHelpDeskDto, HelpDeskDto>
    {
        private readonly IRepository<HelpDesk, int> _repository;
        public HelpDesksAppService(IRepository<HelpDesk, int> repository) : base(repository)
        {
            _repository = repository;
        }


        public async Task<GetHelpDeskForEditOutput> GetHelpDeskForEdit(EntityDto input)
        {
            var helpdesk = await _repository.GetAsync(input.Id);
            var helpdeskdto = ObjectMapper.Map<HelpDeskEditDto>(helpdesk);

            return new GetHelpDeskForEditOutput
            {
                HelpDesk = helpdeskdto
            };
        }
    }

    


    //public class HelpDesksAppService : CrudAppService<HelpDesk, HelpDeskDto>
    //{
    //    public HelpDesksAppService(IRepository<HelpDesk, int> repository) : base(repository)
    //    {
    //    }
    //}
}
