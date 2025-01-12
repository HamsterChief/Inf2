using Microsoft.EntityFrameworkCore;
using SQLitePCL;
using StarterKit.Models;

namespace StarterKit.Services
{
    public class ReservationService : IReservationService
    {
        //TEMPLATE LIST
        List<Reservation> reservations = new List<Reservation>();

        private readonly DatabaseContext _context;
        public ReservationService(DatabaseContext context)
        {
            _context = context;
        }


        // get all reservations
        public List<Reservation> GetAllReservations()
        {
            var reservations = _context.Reservation.Include(r => r.Customer).Include(r => r.TheatreShowDate).ToList();
            return reservations;
        }

        // get reservations by show and date
        public List<Reservation>? GetByShowDate(TheatreShow Tshow)
        {
            //TheatreshowDate has a theatreshow object
            List<Reservation>? R = _context.Reservation.Where(x => x.TheatreShowDate.TheatreShow == Tshow).ToList();
            if (R == null) { Console.WriteLine("reservations not found"); }
            return R;
        }

        public List<Reservation> GetByShowDate(TheatreShowDate Tdate)
        {
            List<Reservation>? R = _context.Reservation.Where(x => x.TheatreShowDate == Tdate).ToList();
            if (R == null) { Console.WriteLine("reservations not found"); }
            return R;
        }


        // get by email and id
        public Reservation? SearchByEmailAndID(string email, int id)
        {
            Reservation? R = _context.Reservation.FirstOrDefault(x => x.ReservationId == id && x.Customer.Email == email);
            if (R == null) { Console.WriteLine("reservation not found"); }
            return R;
        }

        // mark reservation
        public void MarkReservation(Reservation reservation)
        {
            var reservationToUpdate = _context.Reservation.FirstOrDefault(r => r == reservation);

            if (reservationToUpdate != null)
            {
                reservationToUpdate.Used = true;
                _context.SaveChanges(); // Ensure the changes are saved to the database
            }
        }


        // remove Reservation
        public void DeleteReservation(Reservation reservation)
        {
            _context.Reservation.Remove(reservation);
            return;
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
}