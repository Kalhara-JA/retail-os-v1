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
- **Payload Size Limit**: 4.5MB (Vercel default limit)
- **File Size Limit**: 4.5MB maximum for reliable uploads

### Supported File Types
- **Images**: JPEG, PNG, WebP, GIF, SVG
- **Videos**: MP4, WebM, OGG
- **Documents**: PDF, DOC, DOCX, TXT

### Hobby Plan Limitations
- **Memory**: Maximum 2048MB per function
- **Function Timeout**: Maximum 60 seconds
- **File Uploads**: Maximum 4.5MB for reliable uploads
- **Concurrent Functions**: Limited to 12
- **Payload Size**: 4.5MB limit for function payloads

### Troubleshooting Upload Issues

1. **"Request Entity Too Large" / "FUNCTION_PAYLOAD_TOO_LARGE" errors**:
   - **Root Cause**: File size exceeds Vercel's 4.5MB payload limit
   - **Solution**: Use files smaller than 4.5MB
   - **Workaround**: Compress images or use smaller files

2. **"Content too large" errors**:
   - Ensure `BLOB_READ_WRITE_TOKEN` is set
   - Check file size is under 4.5MB
   - Verify file type is supported

3. **Memory limit errors**:
   - Reduce file size (try under 2MB)
   - Optimize images before upload
   - Use compressed formats (WebP for images)

4. **Upload timeouts**:
   - Large files may timeout on Hobby plan
   - Ensure stable network connection
   - Consider upgrading to Pro plan for larger files

5. **Vercel deployment issues**:
   - Verify all environment variables are set in Vercel dashboard
   - Check Vercel Blob storage is enabled
   - Ensure function timeout and memory limits are configured correctly

## Development vs Production

### Development
- File uploads use local storage
- No Vercel Blob storage required
- All environment variables optional except `DATABASE_URI` and `PAYLOAD_SECRET`
- No payload size limits

### Production (Hobby Plan)
- File uploads use Vercel Blob storage
- All environment variables required
- Conservative file size limits (4.5MB max)
- Memory-optimized configuration
- Payload size limits enforced

### Production (Pro Plan)
- Higher memory limits (up to 3008MB)
- Longer function timeouts
- Support for larger file uploads (up to 50MB)
- More concurrent functions
- Higher payload limits

## File Upload Endpoints

### Standard Payload Upload
- **Endpoint**: `/api/media` (Payload's default)
- **Limit**: 4.5MB (Vercel payload limit)
- **Use Case**: Small files, standard uploads

### Custom Upload Endpoint
- **Endpoint**: `/api/upload-media`
- **Limit**: 4.5MB (with better error handling)
- **Use Case**: When you need custom upload logic

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
   - Higher payload limits

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for `PAYLOAD_SECRET`
- Keep `BLOB_READ_WRITE_TOKEN` secure
- Use app passwords for SMTP authentication

## Performance Tips for Hobby Plan

1. **Optimize Images**: Use WebP format and compress before upload
2. **Limit File Sizes**: Keep files under 4.5MB for best reliability
3. **Use CDN**: Vercel Blob storage provides CDN benefits
4. **Monitor Usage**: Keep track of function execution times and memory usage
5. **Batch Uploads**: Upload multiple small files instead of one large file

## Error Resolution

### Common Error Messages and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `FUNCTION_PAYLOAD_TOO_LARGE` | File > 4.5MB | Use smaller file or compress |
| `Request Entity Too Large` | File > 4.5MB | Use smaller file or compress |
| `Memory limit exceeded` | File too large for memory | Use smaller file |
| `Upload timeout` | Large file taking too long | Use smaller file or better connection |
| `Content too large` | File exceeds limits | Use smaller file |

### File Size Recommendations

- **Images**: Under 2MB (WebP format recommended)
- **Videos**: Under 4MB (compressed)
- **Documents**: Under 1MB
- **Total upload**: Under 4.5MB per file
