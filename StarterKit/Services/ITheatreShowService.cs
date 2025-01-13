using StarterKit.Models;

namespace StarterKit.Services;

public interface ITheatreShowService {
    IEnumerable<TheatreShow> GetShows();         
    TheatreShow? GetShow(int id);                
    void CreateShow(TheatreShow show);           
    void UpdateShow(int id, TheatreShow show);   
    void DeleteShow(int id);   

    void AddDatesToShow(int showId, List<TheatreShowDate> dates);           
}
