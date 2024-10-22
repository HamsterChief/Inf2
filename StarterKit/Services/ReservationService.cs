using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Services;

public class ReservationService : IReservationService
{
    private readonly DatabaseContext _context;
    public ReservationService(DatabaseContext context)
    {
        _context = context;
    }

    public double CalculateTotalPrice(List<Reservation> reservations)
    {
        return reservations.Select(r => r.TheatreShowDate.TheatreShow.Price * r.AmountOfTickets).Count();
    }

    public async Task SaveReservations(List<Reservation> reservations)
    {
        await _context.Reservation.AddRangeAsync(reservations);
        await _context.SaveChangesAsync();
        return;
    }
}