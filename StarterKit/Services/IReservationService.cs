using StarterKit.Models;

namespace StarterKit.Services;

public interface IReservationService
{
    double CalculateTotalPrice(List<Reservation> reservations);
    public Task SaveReservations(List<Reservation> reservations);
}
