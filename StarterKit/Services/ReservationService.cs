using StarterKit.Models;

namespace StarterKit.Services
{
    public class ReservationService : IReservationService
    {
        List<Reservation> reservations = new List<Reservation>();

        // get all reservations
        public List<Reservation> GetAllReservations()
        {
            return reservations;
        }

        // get reservations by show and date
        public List<Reservation>? GetByShowDate(TheatreShow Tshow)
        {
            //TheatreshowDate has a theatreshow object
            List<Reservation>? R = reservations.Where(x => x.TheatreShowDate.TheatreShow == Tshow).ToList();
            if (R == null) { Console.WriteLine("reservations not found"); }
            return R;
        }

        public List<Reservation> GetByShowDate(TheatreShowDate Tdate)
        {
            List<Reservation>? R = reservations.Where(x => x.TheatreShowDate == Tdate).ToList();
            if (R == null) { Console.WriteLine("reservations not found"); }
            return R;
        }


        // get by email and id
        public Reservation? SearchByEmailAndID(string email, int id)
        {
            Reservation? R = reservations.FirstOrDefault(x => x.ReservationId == id && x.Customer.Email == email);
            if (R == null) { Console.WriteLine("reservation not found");  }
            return R;
        }

        // mark reservation
        public void MarkReservation(Reservation reservation)
        {
            int index = reservations.FindIndex(r => r == reservation);
            if (index != -1)
            {
                // Update the reservation at the found index
                reservations[index].Used = true; // Replace the reservation in the list with the new data
                Console.WriteLine("Reservation marked and updated successfully.");
            }
            else
            {
                Console.WriteLine("Reservation not found.");
            }
        }


        // remove Reservation
        public void DeleteReservation(Reservation reservation)
        {
            reservations.Remove(reservation);
            return;
        }
    }
}

//public class Reservation
//{
//    public int ReservationId { get; set; }

//    public int AmountOfTickets { get; set; }

//    public bool Used { get; set; }

//    public Customer? Customer { get; set; }

//    public TheatreShowDate? TheatreShowDate { get; set; }
//}

//public class TheatreShowDate
//{
//    public int TheatreShowDateId { get; set; }

//    public DateTime DateAndTime { get; set; } //"MM-dd-yyyy HH:mm"

//    public List<Reservation>? Reservations { get; set; }

//    public TheatreShow? TheatreShow { get; set; }

//}

//public class TheatreShow
//{
//    public int TheatreShowId { get; set; }

//    public string? Title { get; set; }

//    public string? Description { get; set; }

//    public double Price { get; set; }

//    public List<TheatreShowDate>? theatreShowDates { get; set; }

//    public Venue? Venue { get; set; }

//}