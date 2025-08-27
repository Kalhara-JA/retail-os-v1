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

The project is configured to handle file uploads with the following setup optimized for Vercel Hobby plan:

### Vercel Configuration (Hobby Plan)
- **Function Timeout**: 60 seconds
- **Memory Allocation**: 2048MB (Hobby plan limit)
- **Body Size Limit**: 10MB (conservative for Hobby plan)
- **File Size Limit**: 10MB maximum

### Supported File Types
- **Images**: JPEG, PNG, WebP, GIF, SVG
- **Videos**: MP4, WebM, OGG
- **Documents**: PDF, DOC, DOCX, TXT

### Hobby Plan Limitations
- **Memory**: Maximum 2048MB per function
- **Function Timeout**: Maximum 60 seconds
- **File Uploads**: Recommended under 10MB for reliable uploads
- **Concurrent Functions**: Limited to 12

### Troubleshooting Upload Issues

1. **"Content too large" errors**:
   - Ensure `BLOB_READ_WRITE_TOKEN` is set
   - Check file size is under 10MB
   - Verify file type is supported

2. **Memory limit errors**:
   - Reduce file size (try under 5MB)
   - Optimize images before upload
   - Use compressed formats (WebP for images)

3. **Upload timeouts**:
   - Large files may timeout on Hobby plan
   - Ensure stable network connection
   - Consider upgrading to Pro plan for larger files

4. **Vercel deployment issues**:
   - Verify all environment variables are set in Vercel dashboard
   - Check Vercel Blob storage is enabled
   - Ensure function timeout and memory limits are configured correctly

## Development vs Production

### Development
- File uploads use local storage
- No Vercel Blob storage required
- All environment variables optional except `DATABASE_URI` and `PAYLOAD_SECRET`

### Production (Hobby Plan)
- File uploads use Vercel Blob storage
- All environment variables required
- Conservative file size limits (10MB max)
- Memory-optimized configuration

### Production (Pro Plan)
- Higher memory limits (up to 3008MB)
- Longer function timeouts
- Support for larger file uploads (up to 50MB)
- More concurrent functions

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

## Upgrading to Pro Plan

If you need to handle larger files or have higher performance requirements:

1. **Upgrade Vercel Plan**: Change from Hobby to Pro plan
2. **Update Configuration**: 
   - Increase memory limit to 3008MB in `vercel.json`
   - Increase file size limit to 50MB
   - Extend function timeout if needed

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for `PAYLOAD_SECRET`
- Keep `BLOB_READ_WRITE_TOKEN` secure
- Use app passwords for SMTP authentication

## Performance Tips for Hobby Plan

1. **Optimize Images**: Use WebP format and compress before upload
2. **Limit File Sizes**: Keep files under 5MB for best reliability
3. **Use CDN**: Vercel Blob storage provides CDN benefits
4. **Monitor Usage**: Keep track of function execution times and memory usage
