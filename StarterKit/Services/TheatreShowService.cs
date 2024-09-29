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
        return _context.TheatreShow.Include(s => s.Venue).Include(s => s.theatreShowDates).ToList();
    }

    public TheatreShow? GetShow(int id){
        return _context.TheatreShow.Include(s => s.Venue).Include(s => s.theatreShowDates).FirstOrDefault(show => show.TheatreShowId == id);
    }

    public void CreateShow(TheatreShow show){
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

    public void DeleteShow(int id){
        var ShowToDelete = _context.TheatreShow.Find(id);
        if (ShowToDelete != null){
            _context.TheatreShow.Remove(ShowToDelete);
        }
        _context.SaveChanges();
    }

}