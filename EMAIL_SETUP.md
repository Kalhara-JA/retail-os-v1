# Email Configuration Setup

This document explains how to configure email functionality for the Retail OS newsletter subscription form.

## Environment Variables

Add the following variables to your `.env` file:

```bash
# Email Configuration
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
ADMIN_EMAIL=admin@yourdomain.com
```

## Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification
   - Enable 2-factor authentication

2. **Generate an App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Generate a new app password
   - Use this generated password as `SMTP_PASS`

3. **Configure Environment Variables**
   - Set `SMTP_USER` to your Gmail address
   - Set `SMTP_PASS` to the generated app password
   - Set `EMAIL_FROM` to your Gmail address or a custom domain

## Other Email Providers

### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### AWS SES
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-access-key
SMTP_PASS=your-ses-secret-key
```



## Managing Newsletter Email Content from Footer

The newsletter subscription form email content can now be managed directly from the Footer settings:

1. **Access Footer Settings**
   - Go to your admin panel (usually `/admin`)
   - Navigate to "Globals" → "Footer"
   - Scroll down to "Newsletter Email Configuration"

2. **Email Content Configuration**
   - **Welcome Email Subject**: Subject line for emails sent to new subscribers
   - **Welcome Email Body**: Rich text content for the welcome email
   - **Admin Notification Subject**: Subject line for admin notification emails
   - **Admin Notification Body**: Rich text content for admin notifications

3. **Rich Text Editor**
   - Use the rich text editor to format email content
   - Add headings, paragraphs, lists, and formatting
   - Use variables like `{{email}}`, `{{date}}`, `{{time}}`

4. **Default Content**
   - Default welcome email includes subscription details and welcome message
   - Default admin notification includes subscriber information
   - All content can be customized as needed

5. **Variable Support**
   - `{{email}}` - Subscriber's email address
   - `{{date}}` - Current date
   - `{{time}}` - Current time
   - `{{ip}}` - Subscriber IP (development only)

## Managing Forms with Email Templates

The newsletter subscription form is now managed through Payload's Form Builder:

1. **Access Forms**
   - Go to your admin panel (usually `/admin`)
   - Navigate to "Forms" in the sidebar
   - You'll see the "Newsletter Subscription" form

2. **Form Configuration**
   - **Fields**: Configure form fields (email, text, textarea, select, etc.)
   - **Submit Button**: Customize the submit button text
   - **Confirmation**: Set up success messages or redirects
   - **Email Notifications**: Configure email sending

3. **Email Integration**
   - **Primary**: Footer email configuration (if available)
   - **Fallback**: Custom form messages
   - Use `{{email}}` in the "To" field to send to the subscriber
   - Use `{{fieldName}}` to reference any form field

4. **Automatic Email Selection**
   - **Subscriber Emails**: Use Footer welcome email content
   - **Admin Emails**: Use Footer admin notification content
   - **Fallback**: Custom message content if specified

5. **Form Submission Data**
   - All form submissions are stored in "Form Submissions"
   - View submission data, IP addresses, and timestamps
   - Export data for analysis

## Testing Email Functionality

1. **Start the development server**
   ```bash
   pnpm dev
   ```

2. **Seed the database** (if not already done)
   ```bash
   # Visit /admin and use the seed button, or
   curl http://localhost:3000/api/seed
   ```

3. **Test the newsletter subscription**
   - Go to your website
   - Scroll to the footer
   - Enter an email address in the newsletter form
   - Submit the form
   - Check if you receive the welcome email

## Troubleshooting

### Common Issues

1. **"Missing credentials for PLAIN" error**
   - Make sure `SMTP_USER` and `SMTP_PASS` are set correctly
   - For Gmail, ensure you're using an App Password, not your regular password

2. **"Invalid login" error**
   - Check that your email credentials are correct
   - For Gmail, make sure 2FA is enabled and you're using an App Password

3. **"Unexpected socket close" error**
   - This usually indicates a connection timeout or network issue
   - Try increasing timeout values in your environment:
     ```bash
     SMTP_TIMEOUT=60000
     ```
   - Check if your firewall is blocking SMTP connections
   - Try using a different port (465 for SSL, 587 for TLS)
   - For Gmail, ensure "Less secure app access" is enabled or use App Passwords

4. **Connection timeout errors**
   - Increase connection timeout values
   - Check your internet connection
   - Try using a different SMTP provider

5. **Emails not sending**
   - Check your spam folder
   - Verify that your email provider allows SMTP access
   - Check the server logs for detailed error messages

### Development Mode

If you don't want to configure email during development, the application will still work without email functionality. The newsletter form will show a success message but won't actually send emails.

## Production Considerations

1. **Use a dedicated email service** like SendGrid, Mailgun, or AWS SES for production
2. **Set up proper DNS records** (SPF, DKIM, DMARC) for better deliverability
3. **Monitor email delivery** and bounce rates
4. **Implement rate limiting** to prevent abuse
5. **Add unsubscribe functionality** for compliance with email regulations
