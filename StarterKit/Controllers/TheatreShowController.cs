using Microsoft.AspNetCore.Mvc;
using SQLitePCL;
using StarterKit.Models;
using StarterKit.Services;

[Route("api/v1/theatreshow")]
[ApiController]
public class TheatreShowController : ControllerBase {

    private readonly ITheatreShowService _showService;

    public TheatreShowController(ITheatreShowService showService){
        _showService = showService;
    }

    [HttpGet("all")]
    public IActionResult GetAllShows(){
        var shows = _showService.GetShows();
        return Ok(shows);
    }

    [HttpGet("{id}")]
    public IActionResult GetShow(int id){
        var show = _showService.GetShow(id);
        if (show != null){
            return Ok(show);
        }
        return NotFound("No show found with the given id.");
    }

    [HttpPost("create")]
    public IActionResult CreateShow([FromBody] TheatreShow show){
        _showService.CreateShow(show);
        return Ok("Show has been created.");
    }
}
