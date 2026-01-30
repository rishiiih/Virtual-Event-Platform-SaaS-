# Event API Testing Script
# Make sure backend server is running on port 5000

$baseUrl = "http://localhost:5000/api"

Write-Host "`n=== STEP 1: Register an Organizer ===" -ForegroundColor Cyan
$registerBody = @{
    name = "Event Organizer"
    email = "organizer@test.com"
    password = "OrganizerPass123!"
    role = "organizer"
} | ConvertTo-Json

$register = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
Write-Host "[SUCCESS] Organizer registered" -ForegroundColor Green
$token = $register.data.token
Write-Host "Token: $($token.Substring(0,20))..." -ForegroundColor Yellow

Write-Host "`n=== STEP 2: Create an Event ===" -ForegroundColor Cyan

$locationObj = @{
    type = "hybrid"
    venue = "Tech Convention Center"
    address = "123 Innovation Drive"
    city = "San Francisco"
    country = "USA"
}

$eventData = @{
    title = "Tech Conference 2026"
    description = "Annual technology conference featuring latest trends in AI, Web Development, and Cloud Computing. Join industry leaders and innovators."
    eventType = "conference"
    category = "technology"
    startDate = "2026-03-15T09:00:00Z"
    endDate = "2026-03-17T18:00:00Z"
    maxAttendees = 500
    price = 99.99
    currency = "USD"
    location = $locationObj
    tags = @("AI", "Web Dev", "Cloud")
}

$eventBody = $eventData | ConvertTo-Json -Depth 3

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$createEvent = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Body $eventBody -Headers $headers -ErrorAction Stop
Write-Host "[SUCCESS] Event created" -ForegroundColor Green
$eventId = $createEvent.data.event._id
Write-Host "Event ID: $eventId" -ForegroundColor Yellow
Write-Host "Title: $($createEvent.data.event.title)" -ForegroundColor White
Write-Host "Status: $($createEvent.data.event.status)" -ForegroundColor White

Write-Host "`n=== STEP 3: Get All Events (Public) ===" -ForegroundColor Cyan
$allEvents = Invoke-RestMethod -Uri "$baseUrl/events?limit=5" -Method Get
Write-Host "[SUCCESS] Found $($allEvents.data.events.Count) events" -ForegroundColor Green
foreach ($event in $allEvents.data.events) {
    Write-Host "  - $($event.title) ($($event.status))" -ForegroundColor White
}
Write-Host "Pagination: Page $($allEvents.data.pagination.page)/$($allEvents.data.pagination.pages)" -ForegroundColor Yellow

Write-Host "`n=== STEP 4: Get Event by ID ===" -ForegroundColor Cyan
$singleEvent = Invoke-RestMethod -Uri "$baseUrl/events/$eventId" -Method Get
Write-Host "[SUCCESS] Event details retrieved" -ForegroundColor Green
Write-Host "Title: $($singleEvent.data.event.title)" -ForegroundColor White
Write-Host "Organizer: $($singleEvent.data.event.organizer.name)" -ForegroundColor White
Write-Host "Location: $($singleEvent.data.event.location.type)" -ForegroundColor White
Write-Host "Dates: $($singleEvent.data.event.startDate) to $($singleEvent.data.event.endDate)" -ForegroundColor White
Write-Host "Max Attendees: $($singleEvent.data.event.maxAttendees)" -ForegroundColor White

Write-Host "`n=== STEP 5: Test Filters ===" -ForegroundColor Cyan
$filteredEvents = Invoke-RestMethod -Uri "$baseUrl/events?category=technology&status=draft" -Method Get
Write-Host "[SUCCESS] Filtered events (technology, draft): $($filteredEvents.data.events.Count)" -ForegroundColor Green

Write-Host "`n=== STEP 6: Test Non-Organizer Access ===" -ForegroundColor Cyan
$attendeeBody = @{
    name = "Regular User"
    email = "user@test.com"
    password = "UserPass123!"
    role = "attendee"
} | ConvertTo-Json

$attendeeReg = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $attendeeBody -ContentType "application/json"
$attendeeToken = $attendeeReg.data.token

$attendeeHeaders = @{
    "Authorization" = "Bearer $attendeeToken"
    "Content-Type" = "application/json"
}

$blocked = $false
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Body $eventBody -Headers $attendeeHeaders -ErrorAction Stop
    Write-Host "[FAIL] Attendee should not be able to create events!" -ForegroundColor Red
}
catch {
    $blocked = $true
    Write-Host "[SUCCESS] Attendee correctly blocked from creating events" -ForegroundColor Green
}

Write-Host "`n=== All Tests Complete! ===" -ForegroundColor Green
