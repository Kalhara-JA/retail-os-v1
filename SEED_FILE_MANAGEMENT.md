# Seed File Management System

A comprehensive seed file management system integrated into the Payload CMS admin interface that allows you to generate, manage, and use seed files with timestamps and descriptions.

## 🎯 **Features**

### ✅ **What You Can Do:**

1. **Generate Seed Files** - Create seed files from current database data
2. **Multiple Seed Files** - Save multiple seed files with timestamps
3. **File Management** - List, download, and delete seed files
4. **Selective Seeding** - Choose which seed file to use for seeding
5. **Descriptions** - Add descriptions to seed files for better organization
6. **User Control** - Option to include/exclude user accounts

## 🚀 **How to Access**

### **Admin Interface**
1. Go to your Payload admin dashboard
2. Look for the "Seed File Manager" section
3. Use the interface to manage your seed files

### **API Endpoints**
- `GET /api/seed-files/list` - List all seed files
- `POST /api/generate-seed-file` - Generate new seed file
- `POST /api/seed-from-file` - Seed from specific file
- `DELETE /api/seed-files/delete` - Delete seed file
- `POST /api/seed-files/download` - Download seed file

## 📋 **Step-by-Step Usage**

### **1. Generate a New Seed File**

1. Click **"Generate New Seed File"** button
2. Fill in the form:
   - **Description** (optional): e.g., "Production backup", "Development setup"
   - **Include users**: Check if you want user accounts in the seed file
3. Click **"Generate Seed File"**
4. The file will be saved with a timestamp: `seed-2025-08-18T19-30-35-940Z.json`

### **2. View Available Seed Files**

The system automatically lists all available seed files with:
- **File name** with timestamp
- **Description** (if provided)
- **File size**
- **Creation date**
- **Action buttons**

### **3. Select and Use a Seed File**

1. Click **"Select for Seeding"** on any seed file
2. Review the selected file details
3. Click **"Seed Database Now"** to use that file
4. ⚠️ **Warning**: This will replace all existing data!

### **4. Manage Seed Files**

- **Download**: Save seed file to your computer
- **Delete**: Remove unwanted seed files
- **Refresh**: Update the file list

## 🔧 **File Organization**

### **Directory Structure**
```
src/endpoints/seed/files/
├── seed-2025-08-18T19-30-35-940Z.json
├── seed-2025-08-18T19-39-45-168Z.json
├── seed-production-backup-2025-08-18.json
└── ...
```

### **File Naming Convention**
- **Auto-generated**: `seed-{ISO-timestamp}.json`
- **Custom**: Any name ending with `.json`
- **Timestamps**: ISO 8601 format for easy sorting

### **File Content Structure**
```json
{
  "collections": {
    "pages": [...],
    "posts": [...],
    "categories": [...],
    "media": [...],
    "forms": [...],
    "form-submissions": [...],
    "search": [...],
    "email-templates": [...],
    "users": [...] // if includeUsers=true
  },
  "globals": {
    "header": {...},
    "footer": {...},
    "whatsapp": {...},
    "phone": {...},
    "cookie-consent": {...}
  },
  "generatedAt": "2025-08-18T19:30:35.940Z",
  "version": "1.0.0",
  "description": "Your custom description here"
}
```

## 🛠️ **API Usage**

### **Generate Seed File**
```bash
curl -X POST http://localhost:3000/api/generate-seed-file \
  -H "Content-Type: application/json" \
  -d '{
    "outputPath": "./src/endpoints/seed/files/my-seed.json",
    "description": "Production backup",
    "includeUsers": false
  }'
```

### **List Seed Files**
```bash
curl -X GET http://localhost:3000/api/seed-files/list
```

### **Seed from File**
```bash
curl -X POST http://localhost:3000/api/seed-from-file \
  -H "Content-Type: application/json" \
  -d '{
    "seedFilePath": "./src/endpoints/seed/files/my-seed.json",
    "clearExisting": true
  }'
```

### **Delete Seed File**
```bash
curl -X DELETE http://localhost:3000/api/seed-files/delete \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./src/endpoints/seed/files/my-seed.json"
  }'
```

### **Download Seed File**
```bash
curl -X POST http://localhost:3000/api/seed-files/download \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "./src/endpoints/seed/files/my-seed.json"
  }' \
  --output my-seed.json
```

## 🔄 **Workflow Examples**

### **Development Environment Setup**
1. **Generate seed file** from production database
2. **Add description**: "Production data for development"
3. **Download** the seed file
4. **Change DATABASE_URI** to development database
5. **Upload and seed** from the downloaded file

### **Staging Environment**
1. **Generate seed file** from production
2. **Include users** if needed for testing
3. **Deploy to staging** with the seed file
4. **Seed staging database** from the file

### **Backup Strategy**
1. **Generate daily backups** with descriptions
2. **Keep multiple versions** for rollback
3. **Delete old backups** to save space
4. **Download important backups** for external storage

### **Database Migration**
1. **Generate seed file** from old database
2. **Update DATABASE_URI** to new database
3. **Run migrations** if needed
4. **Seed new database** from the file

## ⚙️ **Configuration Options**

### **Generate Seed File Options**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputPath` | string | `./src/endpoints/seed/files/seed-{timestamp}.json` | Where to save the file |
| `description` | string | `undefined` | Custom description for the file |
| `includeUsers` | boolean | `false` | Include user accounts |
| `generateTypeScript` | boolean | `false` | Generate TypeScript files instead |

### **Seed from File Options**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `seedFilePath` | string | `./src/endpoints/seed/current-data-seed.json` | Path to seed file |
| `clearExisting` | boolean | `true` | Clear existing data before seeding |

## 🔒 **Security Features**

### **File Path Validation**
- All file operations are restricted to the seed files directory
- Prevents access to files outside the designated area
- Validates file paths before any operation

### **Data Safety**
- Confirmation dialogs for destructive operations
- Clear warnings before seeding
- Backup recommendations

### **Error Handling**
- Graceful error handling for file operations
- User-friendly error messages
- Fallback options when operations fail

## 📊 **File Management**

### **Automatic Organization**
- Files are sorted by creation date (newest first)
- Timestamps ensure unique file names
- Descriptions help identify file contents

### **Storage Management**
- Monitor file sizes to prevent disk space issues
- Delete old files to maintain performance
- Download important files for external backup

### **File Validation**
- JSON validation before seeding
- File existence checks
- Size and content verification

## 🐛 **Troubleshooting**

### **Common Issues**

1. **File Not Found**
   - Check if the file exists in the correct directory
   - Verify file permissions
   - Refresh the file list

2. **Permission Errors**
   - Ensure write permissions for the seed files directory
   - Check file ownership
   - Verify directory exists

3. **Large File Issues**
   - Monitor file sizes
   - Consider splitting large databases
   - Check available disk space

4. **Seeding Failures**
   - Verify JSON file is valid
   - Check database connection
   - Review error logs

### **Recovery Options**

1. **Use Backup Files**
   - Download important seed files
   - Keep external backups
   - Use version control for critical files

2. **Manual Recovery**
   - Access files directly in the filesystem
   - Use CLI commands as backup
   - Restore from external backups

## 🔗 **Integration with Existing Features**

### **Enhanced Seeding**
- Works alongside the enhanced seeding system
- Provides additional file management capabilities
- Maintains compatibility with existing workflows

### **CLI Commands**
- CLI commands still available for automation
- API endpoints provide programmatic access
- Admin interface offers user-friendly management

### **Backup System**
- Integrates with existing backup functionality
- Provides additional backup options
- Maintains data consistency across systems

## 📈 **Best Practices**

### **File Naming**
- Use descriptive names for important files
- Include dates in custom file names
- Avoid special characters in file names

### **Organization**
- Add descriptions to all seed files
- Delete old files regularly
- Keep important files backed up externally

### **Workflow**
- Test seed files before using in production
- Document your seeding procedures
- Maintain a backup strategy

### **Security**
- Don't include sensitive data in seed files
- Secure access to seed file directory
- Monitor file access and usage

This seed file management system provides a complete solution for managing database seed files with timestamps, descriptions, and full file management capabilities directly in your Payload CMS admin interface.
