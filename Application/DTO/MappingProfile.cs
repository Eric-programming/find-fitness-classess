using Application.TrainingClasses;
using AutoMapper;
using Domain;

namespace Application.DTO
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<TrainingClass, OutputTrainingClass>()
                .ForMember(destinationMember => destinationMember.Time, OperatingSystem => OperatingSystem.MapFrom(sourceMember => TimeConverter.MinsToTime(sourceMember.Time)));
            CreateMap<UserTrainingClass, OutputUserTrainingClass>()
                .ForMember(destinationMember => destinationMember.userName, OperatingSystem => OperatingSystem.MapFrom(sourceMember => sourceMember.User.UserName))
                .ForMember(destinationMember => destinationMember.fullName, OperatingSystem => OperatingSystem.MapFrom(sourceMember => sourceMember.User.FullName))
                .ForMember(destinationMember => destinationMember.image, OperatingSystem => OperatingSystem.MapFrom(sourceMember => sourceMember.User.photoUrl));
            CreateMap<Domain.Comment, OutputComment>()
                .ForMember(destinationMember => destinationMember.userName, OperatingSystem => OperatingSystem.MapFrom(sourceMember => sourceMember.Author.UserName))
                .ForMember(destinationMember => destinationMember.Image, OperatingSystem => OperatingSystem.MapFrom(sourceMember => sourceMember.Author.photoUrl))
                .ForMember(destinationMember => destinationMember.fullName, OperatingSystem => OperatingSystem.MapFrom(sourceMember => sourceMember.Author.FullName));

        }
    }
}