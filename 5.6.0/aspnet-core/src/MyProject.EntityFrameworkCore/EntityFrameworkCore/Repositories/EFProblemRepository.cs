using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MyProject.Problems;

namespace MyProject.EntityFrameworkCore.Repositories
{
    public class EFProblemRepository:IProblemRepository
    {
        private MyProjectDbContext context;
        public EFProblemRepository(MyProjectDbContext ctx)
        {
            context = ctx;
        }
        public IQueryable<Problem> Problems => context.problems;
        public void SaveProblem(Problem problem)
        {
            if (problem.ProblemId == 0)
            {
                context.problems.Add(problem);
            }
            else
            {
                Problem dbEntry = context.problems
                    .FirstOrDefault(p => p.ProblemId == problem.ProblemId);
                if (dbEntry != null)
                {
                    dbEntry.Name = problem.Name;
                    dbEntry.Description = problem.Description;
                    dbEntry.SurName = problem.SurName;
                    dbEntry.Email = problem.Email;
                }
            }
            context.SaveChanges();
        }
    }
}
