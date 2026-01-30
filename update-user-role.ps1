# Update user to organizer role
$email = Read-Host "Enter your email"

$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email = $email
    role = "organizer"
} | ConvertTo-Json

try {
    Write-Host "Updating user role to organizer..." -ForegroundColor Yellow
    
    # You'll need to create a MongoDB update script or use Compass
    # For now, this is a template
    Write-Host @"
To update your user to organizer role, run this in MongoDB Compass or mongo shell:

db.users.updateOne(
  { email: "$email" },
  { `$set: { role: "organizer" } }
)

Or use this PowerShell command with your JWT token:
"@ -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
