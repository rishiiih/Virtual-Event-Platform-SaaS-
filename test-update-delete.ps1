# Test Update and Delete Event Operations
$baseUrl = "http://localhost:5000/api"

Write-Host "`n=== STEP 1: Login as Organizer ===" -ForegroundColor Cyan
$loginBody = @{
    email = "organizer@test.com"
    password = "OrganizerPass123!"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "[SUCCESS] Logged in as organizer" -ForegroundColor Green
$token = $login.data.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n=== STEP 2: Create a Test Event ===" -ForegroundColor Cyan

$locationObj = @{
    type = "online"
    venue = "Zoom Meeting"
}

$eventData = @{
    title = "Workshop: Advanced React"
    description = "Learn advanced React patterns including hooks, context, and performance optimization techniques."
    eventType = "workshop"
    category = "technology"
    startDate = "2026-04-10T14:00:00Z"
    endDate = "2026-04-10T18:00:00Z"
    maxAttendees = 50
    price = 29.99
    location = $locationObj
}

$eventBody = $eventData | ConvertTo-Json -Depth 3
$createEvent = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Body $eventBody -Headers $headers
$eventId = $createEvent.data.event._id
Write-Host "[SUCCESS] Event created with ID: $eventId" -ForegroundColor Green
Write-Host "Original Title: $($createEvent.data.event.title)" -ForegroundColor White
Write-Host "Original Price: $($createEvent.data.event.price)" -ForegroundColor White

Write-Host "`n=== STEP 3: Update Event ===" -ForegroundColor Cyan
$updateData = @{
    title = "Workshop: Advanced React & Next.js"
    price = 39.99
    maxAttendees = 75
} | ConvertTo-Json

$updatedEvent = Invoke-RestMethod -Uri "$baseUrl/events/$eventId" -Method Put -Body $updateData -Headers $headers
Write-Host "[SUCCESS] Event updated" -ForegroundColor Green
Write-Host "New Title: $($updatedEvent.data.event.title)" -ForegroundColor Yellow
Write-Host "New Price: $($updatedEvent.data.event.price)" -ForegroundColor Yellow
Write-Host "New Max Attendees: $($updatedEvent.data.event.maxAttendees)" -ForegroundColor Yellow

Write-Host "`n=== STEP 4: Verify Update ===" -ForegroundColor Cyan
$verifyEvent = Invoke-RestMethod -Uri "$baseUrl/events/$eventId" -Method Get
Write-Host "[SUCCESS] Event retrieved" -ForegroundColor Green
Write-Host "Title: $($verifyEvent.data.event.title)" -ForegroundColor White
Write-Host "Price: $($verifyEvent.data.event.price)" -ForegroundColor White

Write-Host "`n=== STEP 5: Test Unauthorized Update ===" -ForegroundColor Cyan
$attendeeLogin = @{
    email = "user@test.com"
    password = "UserPass123!"
} | ConvertTo-Json

$attendeeAuth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $attendeeLogin -ContentType "application/json"
$attendeeHeaders = @{
    "Authorization" = "Bearer $($attendeeAuth.data.token)"
    "Content-Type" = "application/json"
}

try {
    $null = Invoke-RestMethod -Uri "$baseUrl/events/$eventId" -Method Put -Body $updateData -Headers $attendeeHeaders -ErrorAction Stop
    Write-Host "[FAIL] Attendee should not be able to update events!" -ForegroundColor Red
}
catch {
    Write-Host "[SUCCESS] Attendee correctly blocked from updating event" -ForegroundColor Green
}

Write-Host "`n=== STEP 6: Delete Event ===" -ForegroundColor Cyan
$deleteResult = Invoke-RestMethod -Uri "$baseUrl/events/$eventId" -Method Delete -Headers $headers
Write-Host "[SUCCESS] Event deleted" -ForegroundColor Green
Write-Host "Message: $($deleteResult.message)" -ForegroundColor White

Write-Host "`n=== STEP 7: Verify Deletion ===" -ForegroundColor Cyan
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/events/$eventId" -Method Get -ErrorAction Stop
    Write-Host "[FAIL] Event should not exist!" -ForegroundColor Red
}
catch {
    Write-Host "[SUCCESS] Event not found (correctly deleted)" -ForegroundColor Green
}

Write-Host "`n=== All Update/Delete Tests Complete! ===" -ForegroundColor Green
