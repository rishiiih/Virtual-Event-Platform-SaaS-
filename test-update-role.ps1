# Test script to update user role to organizer
# Replace YOUR_EMAIL and YOUR_JWT_TOKEN with your actual values

$email = "YOUR_EMAIL"  # Change this to your email
$token = "YOUR_JWT_TOKEN"  # Get this from browser localStorage after login

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    role = "organizer"
} | ConvertTo-Json

try {
    Write-Host "Updating user role to organizer..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/update-role" `
        -Method PATCH `
        -Headers $headers `
        -Body $body
    
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}
