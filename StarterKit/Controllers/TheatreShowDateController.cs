using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using System;
using System.Threading.Tasks;

[Route("api/v1/date")]
[ApiController]


public class TheatreShowDateController : ControllerBase
{
    private readonly DatabaseContext _context;

    public TheatreShowDateController(DatabaseContext context)
    {
        _context = context;
    }

    // POST: api/TheatreShowDate/create
    [HttpPost("create")]
    public async Task<IActionResult> CreateTheatreShowDate([FromBody] TheatreShowDate theatreShowDate)
    {
        if (theatreShowDate == null)
        {
            return BadRequest("Theatre show date is null.");
        }

        // Valideer of de DateAndTime correct is (optioneel)
        if (theatreShowDate.DateAndTime == default)
        {
            return BadRequest("Invalid date and time.");
        }

        try
        {
            // Haal de show op met het theatreshowId uit de database
            var theatreShow = await _context.TheatreShow
                .FirstOrDefaultAsync(ts => ts.TheatreShowId == theatreShowDate.TheatreShow.TheatreShowId);

            if (theatreShow == null)
            {
                return BadRequest("Theatre show not found.");
            }

            // Koppel de gevonden TheatreShow aan de TheatreShowDate
            theatreShowDate.TheatreShow = theatreShow;

            // Voeg de TheatreShowDate toe aan de database
            _context.TheatreShowDate.Add(theatreShowDate);
            await _context.SaveChangesAsync();

            // Return een CreatedAtAction response met de nieuwe TheatreShowDate
            return CreatedAtAction(nameof(GetTheatreShowDateById), 
                new { id = theatreShowDate.TheatreShowDateId }, theatreShowDate);
        }
        catch (Exception ex)
        {
            // Return een BadRequest met foutmelding
            return BadRequest($"Error creating theatre show date: {ex.Message}");
        }
    }


    // GET: api/TheatreShowDate/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTheatreShowDateById(int id)
    {
        var theatreShowDate = await _context.TheatreShowDate
            .Include(tsd => tsd.Reservations)
            .Include(tsd => tsd.TheatreShow)
            .FirstOrDefaultAsync(tsd => tsd.TheatreShowDateId == id);

        if (theatreShowDate == null)
        {
            return NotFound();
        }

        return Ok(theatreShowDate);
    }
}

