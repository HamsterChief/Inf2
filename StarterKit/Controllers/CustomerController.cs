using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using System;
using System.Threading.Tasks;

[Route("api/v1/customer")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly DatabaseContext _context;

    public CustomerController(DatabaseContext context)
    {
        _context = context;
    }

    // GET: api/v1/customer
    [HttpGet]
    public async Task<IActionResult> GetAllCustomers()
    {
        var customers = await _context.Customer
            .Include(c => c.Reservations)  // Zorg ervoor dat je gerelateerde reserveringen ophaalt
            .ToListAsync();

        if (customers == null || customers.Count == 0)
        {
            return NotFound("No customers found.");
        }

        return Ok(customers);
    }

    // GET: api/v1/customer/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomerById(int id)
    {
        var customer = await _context.Customer
            .Include(c => c.Reservations)  // Zorg ervoor dat je gerelateerde reserveringen ophaalt
            .FirstOrDefaultAsync(c => c.CustomerId == id);

        if (customer == null)
        {
            return NotFound($"Customer with id {id} not found.");
        }

        return Ok(customer);
    }

    // POST: api/v1/customer
    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromBody] Customer customer)
    {
        if (customer == null)
        {
            return BadRequest("Customer is null.");
        }

        // Voeg de klant toe aan de database
        _context.Customer.Add(customer);
        await _context.SaveChangesAsync();

        // Return een CreatedAtAction response
        return CreatedAtAction(nameof(GetCustomerById), new { id = customer.CustomerId }, customer);
    }

}
