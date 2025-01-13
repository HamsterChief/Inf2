using Microsoft.AspNetCore.Mvc;
using SQLitePCL;
using StarterKit.Models;
using StarterKit.Services;

[Route("api/v1/reservation")]
public class ReservationController : Controller
{
    // AUTH_SESSION TEMPLATE NOT SECURE
    private string AUTH_SESSION_KEY = "admin_login";
    private readonly DatabaseContext _context;
    IReservationService ReservationService;
    public ReservationController(IReservationService reservationService, DatabaseContext context)
    {
        ReservationService = reservationService;
        _context = context;
    }

    [HttpGet("all")]
    public IActionResult GetAllReservations()
    {
        // code to return all reservations
        return Ok(ReservationService.GetAllReservations());
    }

    [HttpGet("searchshow")]
    public IActionResult GetByShowDate(TheatreShow show, TheatreShowDate date)
    {
        // check if data is transfered 
        if (show == null && date == null) { return BadRequest("No data"); }
        // Uses overloaded function to acces through Tshow or Tdate
        if (date == null) { return Ok(ReservationService.GetByShowDate(show)); }
        if (show == null) { return Ok(ReservationService.GetByShowDate(date)); }
        // Fail result
        return BadRequest("Unknown error");
    }

    [HttpGet("search")]
    public IActionResult SearchByEmailAndID(string email, int id)
    {
        // only admin function
        if (AUTH_SESSION_KEY != "admin_login") { return BadRequest("No acces"); }
        return Ok(ReservationService.SearchByEmailAndID(email, id));
    }

    [HttpPut("mark")]
    public IActionResult MarkReservation(Reservation reservation)
    {
        // admin only marking is same as scanning ticket on entry
        if (AUTH_SESSION_KEY != "admin_login") { return BadRequest("No acces"); }
        ReservationService.MarkReservation(reservation);
        return Ok($"Marked reservation with id:{reservation.ReservationId}");
    }

    [HttpDelete("RemoveReservation")]
    public IActionResult DeleteReservation(Reservation reservation)
    {
        // admin only remove reservation
        if (AUTH_SESSION_KEY != "admin_login") { return BadRequest("No acces"); }
        ReservationService.DeleteReservation(reservation);
        return Ok($"Removed reservation with id:{reservation.ReservationId}");
    }

    [HttpPost("create")]
    public async Task<IActionResult> MakeReservation([FromBody] Reservation reservation)
    {
        if (reservation == null)
        {
            return BadRequest("Reservation data is required");
        }

        try
        {
            await new ReservationService(_context).SaveReservations(reservation);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);  // If customer or date is not found
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");  // Catch any other unexpected errors
        }
    }
}