using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace Hackathon.Api.Base;

[ApiController]
[Route("api/[controller]/[action]")]
public abstract class BaseApiController : ControllerBase
{
    protected readonly ISender _sender;

    protected BaseApiController(ISender sender)
    {
        _sender = sender;
    }
}