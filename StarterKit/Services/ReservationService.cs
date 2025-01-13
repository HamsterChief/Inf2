﻿using Microsoft.AspNetCore.Http.HttpResults;
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
            return _context.Reservation.ToList();
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
            _context.SaveChangesAsync();
            return;
        }
        public double CalculateTotalPrice(Reservation reservation)
        {
            var show = _context.TheatreShow.FirstOrDefault(x => reservation.TheatreShowDate.TheatreShow == x);
            return show.Price * reservation.AmountOfTickets;
        }

        public async Task SaveReservations(Reservation reservation)
        {
            if (reservation.Customer.FirstName == null || reservation.Customer.LastName == null || reservation.Customer.Email == null)
            {
                var customer = await _context.Customer
                                         .FirstOrDefaultAsync(x => x.CustomerId == reservation.Customer.CustomerId);
                if (customer == null)
                {
                    throw new InvalidOperationException("Customer or TheatreShowDate not found");
                }
                reservation.Customer = customer;
            }
            if (reservation.TheatreShowDate.DateAndTime == null || reservation.TheatreShowDate.Reservations == null || reservation.TheatreShowDate.TheatreShow == null)
            {
                var TheatreDate = await _context.TheatreShowDate
                                            .FirstOrDefaultAsync(x => x.TheatreShowDateId == reservation.TheatreShowDate.TheatreShowDateId);
                if (TheatreDate == null)
                {
                    throw new InvalidOperationException("Customer or TheatreShowDate not found");
                }
                reservation.TheatreShowDate = TheatreDate;
            }

            await _context.Reservation.AddAsync(reservation);
            await _context.SaveChangesAsync();
        }
    }
}
