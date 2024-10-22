using Microsoft.AspNetCore.Mvc;
using SQLitePCL;
using StarterKit.Models;
using StarterKit.Services;

[Route("api/[controller]")]
public class ReservationController
{

    [HttpGet("all")]
    public IActionResult GetAllReservations()
    {
        // code to return all reservations
    }

    [HttpGet("byshow")]
    public IActionResult GetByShowDate(TheatreShow show, string date) 
    {
        // return specific
    }

    [HttpGet("byemail")]
    public IActionResult SearchByEmailAndID(string email, int id) 
    {
        // only admin function
    }

    [HttpPut("mark")]
    public IActionResult MarkReservation(Reservation reservation)
    {
        // admin only marking is same as scanning ticket on entry
    }

    [HttpDelete("RemoveReservation")]
    public IActionResult DeleteReservation(Reservation reservation) 
    {
        // admin only remove reservation
    }
}