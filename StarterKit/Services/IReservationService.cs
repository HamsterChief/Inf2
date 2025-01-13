using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;

namespace StarterKit.Services
{
    public interface IReservationService
    {
        // get all reservations
        public List<Reservation> GetAllReservations();

        // get reservations by show and date
        public List<Reservation> GetByShowDate(TheatreShow show);
        public List<Reservation> GetByShowDate(TheatreShowDate Tdate);


        // get by email and id
        public Reservation SearchByEmailAndID(string email, int id);

        // mark reservation
        public void MarkReservation(Reservation reservation);


        // remove Reservation
        public void DeleteReservation(Reservation reservation);

        double CalculateTotalPrice(Reservation reservation);
        public Task SaveReservations(Reservation reservation);
    }
}