using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using EventZenApi.Data;
using EventZenApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventZenApi.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttendeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AttendeesController> _logger;

        public AttendeesController(
            ApplicationDbContext context, 
            ILogger<AttendeesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/attendees/event/5
        [HttpGet("event/{eventId:int}")]  // Explicit route constraint
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<AttendeeResponseDto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetEventAttendees(int eventId)
        {
            try
            {
                // Input validation
                if (eventId <= 0)
                {
                    _logger.LogWarning("Invalid event ID: {EventId}", eventId);
                    return BadRequest("Event ID must be a positive integer");
                }

                // Authorization check
                if (!await IsUserEventOrganizer(eventId))
                {
                    _logger.LogWarning("Unauthorized access attempt for event {EventId} by user {UserId}", 
                        eventId, User.FindFirstValue(ClaimTypes.NameIdentifier));
                    return Forbid();
                }

                var attendees = await _context.Attendees
                    .AsNoTracking()  // Better performance for read-only
                    .Where(a => a.EventId == eventId)
                    .Select(a => new AttendeeResponseDto(a))
                    .ToListAsync();

                return Ok(attendees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching attendees for event {EventId}", eventId);
                return StatusCode(500, new ApiResponse(500, "An unexpected error occurred"));
            }
        }

        // GET: api/attendees/5
        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AttendeeResponseDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAttendee(int id)
        {
            try
            {
                var attendee = await _context.Attendees
                    .AsNoTracking()
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (attendee == null)
                {
                    _logger.LogWarning("Attendee {AttendeeId} not found", id);
                    return NotFound(new ApiResponse(404, "Attendee not found"));
                }

                if (!await IsUserEventOrganizer(attendee.EventId))
                {
                    _logger.LogWarning("Unauthorized access attempt for attendee {AttendeeId}", id);
                    return Forbid();
                }

                return Ok(new AttendeeResponseDto(attendee));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching attendee {AttendeeId}", id);
                return StatusCode(500, new ApiResponse(500, "An unexpected error occurred"));
            }
        }

        // POST: api/attendees
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(AttendeeResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAttendee([FromBody] CreateAttendeeDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid attendee creation request: {@Errors}", 
                        ModelState.Values.SelectMany(v => v.Errors));
                    return BadRequest(new ApiResponse(400, "Invalid request data"));
                }

// Allow anyone to register, not just event organizers
var isOrganizer = await IsUserEventOrganizer(dto.EventId);
_logger.LogInformation("User {UserId} is registering attendee for event {EventId} (Organizer: {IsOrganizer})", 
    User.FindFirstValue(ClaimTypes.NameIdentifier), dto.EventId, isOrganizer);


                var attendee = new Attendee
                {
                    Name = dto.Name.Trim(),
                    Email = dto.Email.ToLower().Trim(),
                    Phone = dto.Phone?.Trim(),
                    EventId = dto.EventId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Attendees.AddAsync(attendee);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Attendee {AttendeeId} created for event {EventId}", 
                    attendee.Id, attendee.EventId);

                return CreatedAtAction(
                    nameof(GetAttendee), 
                    new { id = attendee.Id }, 
                    new AttendeeResponseDto(attendee));
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while creating attendee");
                return StatusCode(500, new ApiResponse(500, "Error saving attendee to database"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating attendee");
                return StatusCode(500, new ApiResponse(500, "An unexpected error occurred"));
            }
        }

        // PUT: api/attendees/5
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAttendee(int id, [FromBody] UpdateAttendeeDto dto)
        {
            try
            {
                var attendee = await _context.Attendees.FindAsync(id);
                if (attendee == null)
                {
                    return NotFound(new ApiResponse(404, "Attendee not found"));
                }

                if (!await IsUserEventOrganizer(attendee.EventId))
                {
                    _logger.LogWarning("Unauthorized update attempt for attendee {AttendeeId}", id);
                    return Forbid();
                }

                attendee.Name = dto.Name.Trim();
                attendee.Email = dto.Email.ToLower().Trim();
                attendee.Phone = dto.Phone?.Trim();
                attendee.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new ApiResponse(409, "Concurrency conflict detected"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating attendee {AttendeeId}", id);
                return StatusCode(500, new ApiResponse(500, "An unexpected error occurred"));
            }
        }

        // DELETE: api/attendees/5
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAttendee(int id)
        {
            try
            {
                var attendee = await _context.Attendees.FindAsync(id);
                if (attendee == null)
                {
                    return NotFound(new ApiResponse(404, "Attendee not found"));
                }

                if (!await IsUserEventOrganizer(attendee.EventId))
                {
                    _logger.LogWarning("Unauthorized deletion attempt for attendee {AttendeeId}", id);
                    return Forbid();
                }

                _context.Attendees.Remove(attendee);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting attendee {AttendeeId}", id);
                return StatusCode(500, new ApiResponse(500, "An unexpected error occurred"));
            }
        }

        private async Task<bool> IsUserEventOrganizer(int eventId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return !string.IsNullOrEmpty(userId) && 
                   await _context.Events.AnyAsync(e => e.Id == eventId && e.OrganizerId == userId);
        }
    }

    // ===== DTO Classes =====
    public record ApiResponse(int StatusCode, string Message);

    public record AttendeeResponseDto(
        int Id,
        string Name,
        string Email,
        string Phone,
        int EventId,
        DateTime CreatedAt)
    {
        public AttendeeResponseDto(Attendee attendee) : this(
            attendee.Id,
            attendee.Name,
            attendee.Email,
            attendee.Phone,
            attendee.EventId,
            attendee.CreatedAt)
        {
        }
    }

    public record CreateAttendeeDto(
        [Required][StringLength(100)] string Name,
        [Required][EmailAddress] string Email,
        [Phone] string? Phone,
        [Required][Range(1, int.MaxValue)] int EventId);

    public record UpdateAttendeeDto(
        [Required][StringLength(100)] string Name,
        [Required][EmailAddress] string Email,
        [Phone] string? Phone);
}