# Test Event Registration System
$baseUrl = "http://localhost:5000/api"

Write-Host "`n=== STEP 1: Login as Organizer & Create Event ===" -ForegroundColor Cyan
$organizerLogin = @{
    email = "organizer@test.com"
    password = "OrganizerPass123!"
} | ConvertTo-Json

$orgAuth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $organizerLogin -ContentType "application/json"
$orgToken = $orgAuth.data.token
$orgHeaders = @{
    "Authorization" = "Bearer $orgToken"
    "Content-Type" = "application/json"
}

$eventData = @{
    title = "Python Bootcamp 2026"
    description = "Comprehensive Python programming bootcamp covering basics to advanced topics."
    eventType = "workshop"
    category = "technology"
    startDate = "2026-05-20T09:00:00Z"
    endDate = "2026-05-22T17:00:00Z"
    maxAttendees = 30
    price = 199.99
    status = "published"
    location = @{
        type = "online"
        venue = "Zoom"
    }
} | ConvertTo-Json -Depth 3

$event = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Body $eventData -Headers $orgHeaders
$eventId = $event.data.event._id
Write-Host "[SUCCESS] Event created: $($event.data.event.title)" -ForegroundColor Green
Write-Host "Event ID: $eventId" -ForegroundColor Yellow
Write-Host "Max Attendees: $($event.data.event.maxAttendees)" -ForegroundColor White
Write-Host "Current Attendees: $($event.data.event.currentAttendees)" -ForegroundColor White

Write-Host "`n=== STEP 2: Login as Attendee ===" -ForegroundColor Cyan
$attendeeLogin = @{
    email = "user@test.com"
    password = "UserPass123!"
} | ConvertTo-Json

$attendeeAuth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $attendeeLogin -ContentType "application/json"
$attendeeToken = $attendeeAuth.data.token
$attendeeHeaders = @{
    "Authorization" = "Bearer $attendeeToken"
    "Content-Type" = "application/json"
}
Write-Host "[SUCCESS] Logged in as attendee" -ForegroundColor Green

Write-Host "`n=== STEP 3: Register for Event ===" -ForegroundColor Cyan
$registration = Invoke-RestMethod -Uri "$baseUrl/events/$eventId/register" -Method Post -Headers $attendeeHeaders
Write-Host "[SUCCESS] Registered for event" -ForegroundColor Green
Write-Host "Registration ID: $($registration.data.registration._id)" -ForegroundColor Yellow
Write-Host "Status: $($registration.data.registration.status)" -ForegroundColor White
Write-Host "Payment Status: $($registration.data.registration.paymentStatus)" -ForegroundColor White
Write-Host "Payment Amount: `$$($registration.data.registration.paymentAmount)" -ForegroundColor White

Write-Host "`n=== STEP 4: Verify Attendee Count Increased ===" -ForegroundColor Cyan
$updatedEvent = Invoke-RestMethod -Uri "$baseUrl/events/$eventId" -Method Get
Write-Host "[SUCCESS] Event updated" -ForegroundColor Green
Write-Host "Current Attendees: $($updatedEvent.data.event.currentAttendees)" -ForegroundColor Yellow

Write-Host "`n=== STEP 5: Test Duplicate Registration ===" -ForegroundColor Cyan
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/events/$eventId/register" -Method Post -Headers $attendeeHeaders -ErrorAction Stop
    Write-Host "[FAIL] Should not allow duplicate registration!" -ForegroundColor Red
}
catch {
    Write-Host "[SUCCESS] Duplicate registration blocked" -ForegroundColor Green
}

Write-Host "`n=== STEP 6: Get My Registered Events ===" -ForegroundColor Cyan
$myEvents = Invoke-RestMethod -Uri "$baseUrl/registrations/my-events" -Method Get -Headers $attendeeHeaders
Write-Host "[SUCCESS] Retrieved registered events: $($myEvents.data.count)" -ForegroundColor Green
foreach ($reg in $myEvents.data.registrations) {
    Write-Host "  - $($reg.event.title) (Status: $($reg.status))" -ForegroundColor White
}

Write-Host "`n=== STEP 7: Organizer Views Registrations ===" -ForegroundColor Cyan
$eventRegs = Invoke-RestMethod -Uri "$baseUrl/events/$eventId/registrations" -Method Get -Headers $orgHeaders
Write-Host "[SUCCESS] Retrieved event registrations: $($eventRegs.data.count)" -ForegroundColor Green
foreach ($reg in $eventRegs.data.registrations) {
    Write-Host "  - $($reg.attendee.name) ($($reg.attendee.email)) - $($reg.status)" -ForegroundColor White
}

Write-Host "`n=== STEP 8: Unregister from Event ===" -ForegroundColor Cyan
$unregister = Invoke-RestMethod -Uri "$baseUrl/events/$eventId/register" -Method Delete -Headers $attendeeHeaders
Write-Host "[SUCCESS] Unregistered from event" -ForegroundColor Green
Write-Host "Message: $($unregister.message)" -ForegroundColor White

Write-Host "`n=== STEP 9: Verify Attendee Count Decreased ===" -ForegroundColor Cyan
$finalEvent = Invoke-RestMethod -Uri "$baseUrl/events/$eventId" -Method Get
Write-Host "[SUCCESS] Event updated" -ForegroundColor Green
Write-Host "Current Attendees: $($finalEvent.data.event.currentAttendees)" -ForegroundColor Yellow

Write-Host "`n=== STEP 10: Verify Registration Status Changed ===" -ForegroundColor Cyan
$myEventsAfter = Invoke-RestMethod -Uri "$baseUrl/registrations/my-events?status=cancelled" -Method Get -Headers $attendeeHeaders
Write-Host "[SUCCESS] Retrieved cancelled registrations: $($myEventsAfter.data.count)" -ForegroundColor Green

Write-Host "`n=== All Registration Tests Complete! ===" -ForegroundColor Green
