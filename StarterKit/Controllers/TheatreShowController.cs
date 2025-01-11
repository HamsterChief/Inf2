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
        Console.WriteLine(shows);
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

    [HttpGet]
    public IActionResult Get([FromQuery] int? id, [FromQuery] string? title, [FromQuery] string? description
    , [FromQuery] string? venue, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string? sortBy = "title",
    [FromQuery] string? order = "asc"){
        if (id != null) {
            var show = _showService.GetShow((int)id);
            if (show != null){
                return Ok(show);
            }
            return NotFound("No show found with the given id.");
        }
        var shows = _showService.GetShows();

        if (!string.IsNullOrEmpty(title)){
            var title_shows = shows.Where(s => s.Title.Contains(title)).ToList();
            return Ok(title_shows);
        }

        if (!string.IsNullOrEmpty(description)){
            var description_shows = shows.Where(s => s.Description.Contains(description)).ToList();
            return Ok(description_shows);
        }

        if (!string.IsNullOrEmpty(venue)){
            var venues = shows.Where(s => s.Venue != null && s.Venue.Name != null && s.Venue.Name.Equals(venue, StringComparison.OrdinalIgnoreCase)).ToList();
            return Ok(venues);
        }

        if (startDate.HasValue && endDate.HasValue){
            shows = shows.Where(s => s.theatreShowDates != null && s.theatreShowDates
            .Any(d => d.DateAndTime >= startDate && d.DateAndTime <= endDate)).ToList();
        }

        switch (sortBy?.ToLower())
        {
            case "price":
                shows = (order?.ToLower() == "desc")
                        ? shows.OrderByDescending(s => s.Price).ToList()
                        : shows.OrderBy(s => s.Price).ToList();
                break;
            case "date":
                shows = (order?.ToLower() == "desc")
                        ? shows.OrderByDescending(s => s.theatreShowDates.Min(d => d.DateAndTime)).ToList()
                        : shows.OrderBy(s => s.theatreShowDates.Min(d => d.DateAndTime)).ToList();
                break;
            case "title":
            default:
                shows = (order?.ToLower() == "desc")
                        ? shows.OrderByDescending(s => s.Title).ToList()
                        : shows.OrderBy(s => s.Title).ToList();
                break;
        }
        return Ok(shows);
    }

    [HttpPost("create")]
    public IActionResult CreateShow([FromBody] TheatreShow show){
        _showService.CreateShow(show);
        return Ok(show);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateShow(int id, TheatreShow show){
        _showService.UpdateShow(id, show);
        return Ok("Show updated");
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteShow(int id){
        _showService.DeleteShow(id);
        return Ok("Show deleted");
    }
    
}
