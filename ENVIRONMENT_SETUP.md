# Environment Setup Guide

This document outlines all the required environment variables for the Retail OS project.

## Required Environment Variables

### Database Configuration
```env
DATABASE_URI=postgresql://username:password@localhost:5432/retail_os
```

### Payload CMS Configuration
```env
PAYLOAD_SECRET=your-super-secret-payload-key-here
```

### Vercel Blob Storage (for file uploads)
```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### Email Configuration (SMTP)
```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_PORT=587
SMTP_SECURE=false
```

### Vercel Cron Jobs
```env
CRON_SECRET=your-cron-secret-here
```

### Next.js Configuration
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Node Options (for development)
```env
NODE_OPTIONS="--no-deprecation"
```

## File Upload Configuration

The project is configured to handle file uploads up to 50MB with the following setup:

### Vercel Configuration
- **Function Timeout**: 60 seconds
- **Memory Allocation**: 3008MB
- **Body Size Limit**: 50MB

### Supported File Types
- **Images**: JPEG, PNG, WebP, GIF, SVG
- **Videos**: MP4, WebM, OGG
- **Documents**: PDF, DOC, DOCX, TXT

### Troubleshooting Upload Issues

1. **"Content too large" errors**:
   - Ensure `BLOB_READ_WRITE_TOKEN` is set
   - Check file size is under 50MB
   - Verify file type is supported

2. **Upload timeouts**:
   - Large files may take longer to upload
   - Ensure stable network connection
   - Consider optimizing file size

3. **Vercel deployment issues**:
   - Verify all environment variables are set in Vercel dashboard
   - Check Vercel Blob storage is enabled
   - Ensure function timeout and memory limits are configured

## Development vs Production

### Development
- File uploads use local storage
- No Vercel Blob storage required
- All environment variables optional except `DATABASE_URI` and `PAYLOAD_SECRET`

### Production
- File uploads use Vercel Blob storage
- All environment variables required
- Vercel configuration applied automatically

## Setup Instructions

1. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in required values**:
   - Set up PostgreSQL database
   - Configure Vercel Blob storage
   - Set up SMTP for email functionality

3. **Deploy to Vercel**:
   - Add environment variables in Vercel dashboard
   - Enable Vercel Blob storage
   - Deploy the application

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for `PAYLOAD_SECRET`
- Keep `BLOB_READ_WRITE_TOKEN` secure
- Use app passwords for SMTP authentication
