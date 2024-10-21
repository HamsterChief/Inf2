using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StarterKit.Models;
using StarterKit.Services;

[Route("api/v1/reservation")]
[ApiController]
public class ReservationController : Controller {

    private readonly IReservationService _reservationService;

    public ReservationController(IReservationService reservationService){
        _reservationService = reservationService;
    }

    [HttpPost("create")]
    public IActionResult MakeReservation([FromBody] List<Reservation> reservations)
    {
        string Message = "";

        foreach (var reservation in reservations)
        {
            bool IsValid = reservation.TheatreShowDate.DateAndTime < DateTime.Now;
            int SeatsLeft = reservation.TheatreShowDate.TheatreShow.Venue.Capacity;
            bool IsAvailable = SeatsLeft < reservation.AmountOfTickets;

            if (!IsValid) { Message += $"{reservation.TheatreShowDate.TheatreShow.Title} is not available anymore ({reservation.TheatreShowDate.DateAndTime})\n"; }
            if (!IsAvailable) { Message += $"{reservation.TheatreShowDate.TheatreShow.Title} has not enough seats left ({SeatsLeft} left)\n"; }
        }

        if (!string.IsNullOrEmpty(Message)) { return Ok(Message); }

        _reservationService.SaveReservations(reservations);
        return Ok($"Total price of your order is {_reservationService.CalculateTotalPrice(reservations)}");
    }
}
