using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;
using StarterKit.Models;
using StarterKit.Services;

[Route("api/v1/venue")]
[ApiController]
public class VenueController : ControllerBase
{
    private readonly DatabaseContext _context;

    public VenueController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpGet("all")]
    public IActionResult GetAllVenues()
    {
        var venues = _context.Venue.Include(v => v.TheatreShows).ToList();
        return Ok(venues);
    }

    [HttpPost("create")]
    public IActionResult CreateVenue([FromBody] Venue venue)
    {
        if (venue == null || string.IsNullOrEmpty(venue.Name) || venue.Capacity <= 0)
        {
            return BadRequest("Invalid venue data.");
        }

        try
        {
            _context.Venue.Add(venue); 
            _context.SaveChanges(); 

            return Ok(new { message = "Venue created successfully.", venue });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

}
