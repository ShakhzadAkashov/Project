using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MyProject.Problems;


namespace MyProject.EntityFrameworkCore.Repositories
{
    public interface IProblemRepository
    {
        IQueryable<Problem> Problems { get; }
        void SaveProblem(Problem problem);
    }
}
