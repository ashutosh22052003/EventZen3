using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EventZenApi.Data;
using EventZenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations; // Required for validation

namespace EventZenApi.Controllers
{
    [Authorize]
    [Route("api/events")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventResponseDto>>> GetUserEvents()
        {
            string userId = GetCurrentUserId();
            var events = await _context.Events
                .Where(e => e.OrganizerId == userId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

            return Ok(events.Select(e => new EventResponseDto(e)));
        }

        // GET: api/events/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EventResponseDto>> GetEvent(int id)
        {
            if (id <= 0) return BadRequest(new { error = "Invalid event ID" });

            string userId = GetCurrentUserId();
            var @event = await GetUserEvent(id, userId);

            if (@event == null)
                return NotFound(new { error = "Event not found" });

            return Ok(new EventResponseDto(@event));
        }

        // POST: api/events
        [HttpPost]
        public async Task<ActionResult<EventResponseDto>> CreateEvent([FromBody] CreateEventDto eventDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string userId = GetCurrentUserId();
            if (!await UserExists(userId))
                return Unauthorized(new { error = "Invalid user" });

            try
            {
                var newEvent = new Event
                {
                    Title = eventDto.Title,
                    Description = eventDto.Description,
                    StartDate = DateTime.SpecifyKind(eventDto.StartDate, DateTimeKind.Utc), // Ensure UTC
                    EndDate = DateTime.SpecifyKind(eventDto.EndDate, DateTimeKind.Utc),
                    Location = eventDto.Location,
                    Budget = eventDto.Budget,
                    OrganizerId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Events.Add(newEvent);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEvent), new { id = newEvent.Id }, new EventResponseDto(newEvent));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
            }
        }

        // PUT: api/events/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] UpdateEventDto eventDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string userId = GetCurrentUserId();
            var existingEvent = await GetUserEvent(id, userId);
            if (existingEvent == null)
                return NotFound(new { error = "Event not found" });

            try
            {
                existingEvent.Title = eventDto.Title;
                existingEvent.Description = eventDto.Description;
                existingEvent.StartDate = DateTime.SpecifyKind(eventDto.StartDate, DateTimeKind.Utc);
                existingEvent.EndDate = DateTime.SpecifyKind(eventDto.EndDate, DateTimeKind.Utc);
                existingEvent.Location = eventDto.Location;
                existingEvent.Budget = eventDto.Budget;
                existingEvent.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new EventResponseDto(existingEvent));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
            }
        }

        // DELETE: api/events/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            string userId = GetCurrentUserId();
            var existingEvent = await GetUserEvent(id, userId);
            if (existingEvent == null)
                return NotFound(new { error = "Event not found" });

            try
            {
                _context.Events.Remove(existingEvent);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
            }
        }

        // Helper Methods
        private async Task<Event?> GetUserEvent(int eventId, string userId)
        {
            return await _context.Events
                .FirstOrDefaultAsync(e => e.Id == eventId && e.OrganizerId == userId);
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        private async Task<bool> UserExists(string userId)
        {
            return await _context.Users.AnyAsync(u => u.Id == userId);
        }
    }

    // DTOs Defined Below
    public class EventResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }
        public decimal Budget { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public EventResponseDto(Event ev)
        {
            Id = ev.Id;
            Title = ev.Title;
            Description = ev.Description;
            StartDate = ev.StartDate;
            EndDate = ev.EndDate;
            Location = ev.Location;
            Budget = ev.Budget;
            CreatedAt = ev.CreatedAt;
            UpdatedAt = ev.UpdatedAt;
        }
    }

    public class CreateEventDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Budget must be a positive value.")]
        public decimal Budget { get; set; }
    }

    public class UpdateEventDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Budget must be a positive value.")]
        public decimal Budget { get; set; }
    }
}
