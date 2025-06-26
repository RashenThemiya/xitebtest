<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Prescription Quotation Ready</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2d3748;">Hello {{ $user->name }},</h2>

        <p>Your prescription with ID <strong>#{{ $prescription->id }}</strong> has been updated to:</p>

        <p style="font-size: 18px; color: #38a169;"><strong>Quotationed</strong></p>

        <p>You can now log in to your account and view the quotation prepared for your prescription.</p>

        @if($prescription->note)
            <p><strong>Note:</strong> {{ $prescription->note }}</p>
        @endif

        <p>Thank you for using our service.</p>

        <hr style="margin: 30px 0;">

        <p style="font-size: 14px; color: #718096;">This is an automated message from the pharmacy system.</p>
    </div>
</body>
</html>
