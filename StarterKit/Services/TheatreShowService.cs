using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Services;

public class TheatreShowService : ITheatreShowService 
{
    private readonly DatabaseContext _context;
    public TheatreShowService(DatabaseContext context)
    {
        _context = context;
    }

    public IEnumerable<TheatreShow> GetShows()
    {
        var shows = _context.TheatreShow.Include(s => s.Venue).Include(s => s.theatreShowDates).ToList();
        foreach(var show in shows)
        {
            Console.WriteLine($"Show {show.Title} has venue: {show.Venue?.Name ?? "No venue"}");
        }
        return shows;
    }

    public TheatreShow? GetShow(int id){
        return _context.TheatreShow.Include(s => s.Venue).Include(s => s.theatreShowDates).FirstOrDefault(show => show.TheatreShowId == id);
    }

    public void CreateShow(TheatreShow show)
    {
        if (show.Venue != null && show.Venue.VenueId > 0)
        {
            var existingVenue = _context.Venue.FirstOrDefault(v => v.VenueId == show.Venue.VenueId);
            if (existingVenue != null)
            {
                show.Venue = existingVenue; // Koppel de venue als deze bestaat
            }
            else
            {
                throw new InvalidOperationException("De opgegeven VenueId bestaat niet.");
            }
        }
        else
        {
            throw new InvalidOperationException("Er is geen geldige Venue gekoppeld aan de show.");
        }

        _context.TheatreShow.Add(show);
        _context.SaveChanges();
    }



    public void UpdateShow(int id, TheatreShow show){
        var ShowFound = _context.TheatreShow.Find(id);

        if (ShowFound != null){
            ShowFound.Title = show.Title;
            ShowFound.Description = show.Description;
            ShowFound.Price = show.Price;
            ShowFound.theatreShowDates = show.theatreShowDates;
            ShowFound.Venue = show.Venue;

            _context.SaveChanges();
        }
    }



    public void DeleteShow(int id)
    {
        var reservations = _context.Reservation
            .Where(r => r.TheatreShowDate.TheatreShowDateId == id)
            .ToList();

        _context.Reservation.RemoveRange(reservations);

    
        var showToDelete = _context.TheatreShow
        .Include(t => t.Venue) // Zorg ervoor dat we de Venue ook laden
        .FirstOrDefault(t => t.TheatreShowId == id);

        if (showToDelete != null)
        {
            // Verwijder de show uit de lijst van shows van de Venue, indien aanwezig
            if (showToDelete.Venue != null)
            {
                // Verwijder de show uit de venue's lijst van TheatreShows
                showToDelete.Venue.TheatreShows.Remove(showToDelete);
            }

            // Verwijder de show zelf
            _context.TheatreShow.Remove(showToDelete);

            // Sla de wijzigingen op in de database
            _context.SaveChanges();
        }
    }

    public void AddDatesToShow(int showId, List<TheatreShowDate> dates)
    {
        var show = _context.TheatreShow
            .Include(s => s.theatreShowDates) // Laad de datums van de show
            .FirstOrDefault(s => s.TheatreShowId == showId);

        if (show == null)
        {
            throw new InvalidOperationException("Show not found.");
        }

        // Voeg de nieuwe datums toe aan de lijst van show datums
        show.theatreShowDates.AddRange(dates);

        // Sla de wijzigingen op in de database
        _context.SaveChanges();
    }
}