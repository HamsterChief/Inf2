using Microsoft.AspNetCore.Mvc;
using SQLitePCL;
using StarterKit.Models;
using StarterKit.Services;

[Route("api/[controller]")]
public class ReservationController : Controller
{
    // AUTH_SESSION TEMPLATE NOT SECURE
    private string AUTH_SESSION_KEY = "admin_login";
    IReservationService ReservationService;
    public ReservationController(IReservationService reservationService)
    {
        ReservationService = reservationService;
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
}