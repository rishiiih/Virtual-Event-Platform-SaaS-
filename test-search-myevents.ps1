# Test Search and My Events Features
$baseUrl = "http://localhost:5000/api"

Write-Host "`n=== STEP 1: Login as Organizer ===" -ForegroundColor Cyan
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
Write-Host "[SUCCESS] Logged in as organizer" -ForegroundColor Green

Write-Host "`n=== STEP 2: Create Multiple Events ===" -ForegroundColor Cyan

# Event 1 - React Conference
$event1 = @{
    title = "React Summit 2026"
    description = "The biggest React conference featuring Next.js, React Server Components, and modern patterns"
    eventType = "conference"
    category = "technology"
    startDate = "2026-06-15T09:00:00Z"
    endDate = "2026-06-17T18:00:00Z"
    maxAttendees = 500
    price = 299
    status = "published"
    tags = @("React", "Next.js", "JavaScript")
    location = @{ type = "hybrid"; venue = "Tech Center" }
} | ConvertTo-Json -Depth 3

$created1 = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Body $event1 -Headers $orgHeaders
Write-Host "[SUCCESS] Created: $($created1.data.event.title)" -ForegroundColor Green

# Event 2 - Python Workshop
$event2 = @{
    title = "Python Machine Learning Workshop"
    description = "Hands-on workshop covering scikit-learn, TensorFlow, and PyTorch for ML applications"
    eventType = "workshop"
    category = "technology"
    startDate = "2026-07-10T10:00:00Z"
    endDate = "2026-07-12T16:00:00Z"
    maxAttendees = 50
    price = 149
    status = "draft"
    tags = @("Python", "Machine Learning", "AI")
    location = @{ type = "online" }
} | ConvertTo-Json -Depth 3

$created2 = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Body $event2 -Headers $orgHeaders
Write-Host "[SUCCESS] Created: $($created2.data.event.title)" -ForegroundColor Green

# Event 3 - Startup Meetup
$event3 = @{
    title = "Startup Founders Meetup"
    description = "Network with fellow entrepreneurs and discuss startup challenges in the tech industry"
    eventType = "meetup"
    category = "business"
    startDate = "2026-05-05T18:00:00Z"
    endDate = "2026-05-05T21:00:00Z"
    maxAttendees = 100
    price = 0
    status = "published"
    tags = @("Startup", "Networking", "Business")
    location = @{ type = "physical"; venue = "Startup Hub"; city = "San Francisco" }
} | ConvertTo-Json -Depth 3

$created3 = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Body $event3 -Headers $orgHeaders
Write-Host "[SUCCESS] Created: $($created3.data.event.title)" -ForegroundColor Green

Write-Host "`n=== STEP 3: Search Events by Keyword ===" -ForegroundColor Cyan
$searchReact = Invoke-RestMethod -Uri "$baseUrl/events?search=React" -Method Get
Write-Host "[SUCCESS] Search 'React': Found $($searchReact.data.events.Count) events" -ForegroundColor Green
foreach ($event in $searchReact.data.events) {
    Write-Host "  - $($event.title)" -ForegroundColor White
}

Write-Host "`n=== STEP 4: Search by Tag ===" -ForegroundColor Cyan
$searchPython = Invoke-RestMethod -Uri "$baseUrl/events?search=Python" -Method Get
Write-Host "[SUCCESS] Search 'Python': Found $($searchPython.data.events.Count) events" -ForegroundColor Green
foreach ($event in $searchPython.data.events) {
    Write-Host "  - $($event.title)" -ForegroundColor White
}

Write-Host "`n=== STEP 5: Search in Description ===" -ForegroundColor Cyan
$searchML = Invoke-RestMethod -Uri "$baseUrl/events?search=Machine" -Method Get
Write-Host "[SUCCESS] Search 'Machine': Found $($searchML.data.events.Count) events" -ForegroundColor Green
foreach ($event in $searchML.data.events) {
    Write-Host "  - $($event.title)" -ForegroundColor White
}

Write-Host "`n=== STEP 6: Get My Events (Organizer) ===" -ForegroundColor Cyan
$myEvents = Invoke-RestMethod -Uri "$baseUrl/events/my/organized" -Method Get -Headers $orgHeaders
Write-Host "[SUCCESS] My Events: $($myEvents.data.events.Count) total" -ForegroundColor Green
foreach ($event in $myEvents.data.events) {
    Write-Host "  - $($event.title) (Status: $($event.status))" -ForegroundColor White
}

Write-Host "`n=== STEP 7: Filter My Events by Status ===" -ForegroundColor Cyan
$myDrafts = Invoke-RestMethod -Uri "$baseUrl/events/my/organized?status=draft" -Method Get -Headers $orgHeaders
Write-Host "[SUCCESS] My Draft Events: $($myDrafts.data.events.Count)" -ForegroundColor Green
foreach ($event in $myDrafts.data.events) {
    Write-Host "  - $($event.title)" -ForegroundColor White
}

$myPublished = Invoke-RestMethod -Uri "$baseUrl/events/my/organized?status=published" -Method Get -Headers $orgHeaders
Write-Host "[SUCCESS] My Published Events: $($myPublished.data.events.Count)" -ForegroundColor Green

Write-Host "`n=== STEP 8: Update Event Status ===" -ForegroundColor Cyan
$statusUpdate = @{
    status = "published"
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri "$baseUrl/events/$($created2.data.event._id)/status" -Method Patch -Body $statusUpdate -Headers $orgHeaders
Write-Host "[SUCCESS] Status updated to: $($updated.data.event.status)" -ForegroundColor Green
Write-Host "Event: $($updated.data.event.title)" -ForegroundColor White

Write-Host "`n=== STEP 9: Verify Published Events Increased ===" -ForegroundColor Cyan
$myPublishedAfter = Invoke-RestMethod -Uri "$baseUrl/events/my/organized?status=published" -Method Get -Headers $orgHeaders
Write-Host "[SUCCESS] My Published Events: $($myPublishedAfter.data.events.Count)" -ForegroundColor Green

Write-Host "`n=== STEP 10: Combined Search & Filter ===" -ForegroundColor Cyan
$combined = Invoke-RestMethod -Uri "$baseUrl/events?search=tech&category=technology&status=published" -Method Get
Write-Host "[SUCCESS] Search 'tech' + technology + published: Found $($combined.data.events.Count) events" -ForegroundColor Green

Write-Host "`n=== All Search & My Events Tests Complete! ===" -ForegroundColor Green
