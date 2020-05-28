using System;
using AutoMapper;
using Domain;

namespace Application.DTO
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<TrainingClass, OutputTrainingClass>();
            CreateMap<UserTrainingClass, OutputUserTrainingClass>().ForMember(destinationMember => destinationMember.userName, OperatingSystem => OperatingSystem.MapFrom(sourceMember => sourceMember.User.UserName));

            // CreateMap<ICollection<Domain.UserTrainingClass>, ICollection<OutputUserTrainingClass>> ();
            // CreateMap<ICollection<Domain.TrainingClass>, ICollection<OutputTrainingClass>> ();

        }
    }
}