# File Upload POC with Real-time WebSocket Status Tracking

A proof of concept demonstrating file uploads with real-time progress tracking using **Pusher WebSocket**, **C# ASP.NET Core** backend, and **React** frontend.

![POC Demo](https://img.shields.io/badge/Status-Working-brightgreen) ![WebSocket](https://img.shields.io/badge/WebSocket-Pusher-blue) ![Backend](https://img.shields.io/badge/Backend-C%23%20ASP.NET%20Core-purple) ![Frontend](https://img.shields.io/badge/Frontend-React-cyan)

## Features

- **HTTP File Upload** - Secure multipart file uploads via REST API
- **Real-time Progress Tracking** - WebSocket updates via Pusher Channels
- **Multiple File Support** - Upload multiple files simultaneously
- **Test File Generation** - Generate files of different sizes for testing
- **Status Indicators** - Visual progress with "in_progress", "completed", "failed" states
- **Error Handling** - Graceful error handling and user feedback

## Architecture

```
┌─────────────────┐    HTTP POST     ┌──────────────────────┐
│   React Client  │ ──────────────► │   C# ASP.NET Core    │
│                 │                  │      Backend         │
│  • File Upload  │                  │                      │
│  • Status UI    │                  │ • Process Upload     │
│                 │                  │ • Trigger Pusher     │
└─────────────────┘                  └──────────────────────┘
         ▲                                        │
         │                                        ▼
         │            ┌──────────────────────┐               
         │            │   Pusher Channels    │               
         └────────────│                      │               
      WebSocket       │ • Real-time Events   │               
      Updates         │ • Status Updates     │               
                      └──────────────────────┘               
```

## Quick Start

### Prerequisites

- **.NET 8.0+** SDK
- **Node.js 16+** and npm
- **Pusher Account** (free tier available)

### 1. Setup Pusher

1. Sign up at [pusher.com](https://pusher.com)
2. Create a new **Channels** app
3. Note your credentials:
   - App ID
   - Key  
   - Secret
   - Cluster

### 2. Backend Setup

```bash
# Clone and navigate to backend
mkdir FileUploadPOC && cd FileUploadPOC
dotnet new webapi

# Install Pusher package
dotnet add package PusherServer

# Run the backend
dotnet run --urls "http://localhost:5000"
```

**Configure `appsettings.json`:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Pusher": {
    "AppId": "YOUR_APP_ID",
    "Key": "YOUR_KEY", 
    "Secret": "YOUR_SECRET",
    "Cluster": "YOUR_CLUSTER"
  }
}
```

### 3. Frontend Setup

```bash
# Create React app
npx create-react-app file-upload-frontend
cd file-upload-frontend

# Install dependencies
npm install pusher-js lucide-react

# Run the frontend
npm start
```

## Project Structure

```
FileUploadPOC/
├── Backend/                     # C# ASP.NET Core API
│   ├── Controllers/
│   │   └── UploadController.cs  # File upload endpoints
│   ├── Services/
│   │   └── PusherService.cs     # Pusher WebSocket service
│   ├── Program.cs               # App configuration
│   ├── appsettings.json         # Configuration & credentials
│   └── uploads/                 # Uploaded files storage
│
├── Frontend/                    # React Application
│   ├── src/
│   │   ├── App.js              # Main upload component
│   │   └── index.css           # Styling
│   └── public/
│
└── README.md                   # This file
```

## API Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/upload/health` | Health check | `200 OK` |
| `GET` | `/api/upload/status/{fileId}` | Get upload status | Status info |
| `POST` | `/api/upload` | Upload file | Upload result |
| `POST` | `/api/upload/test-pusher` | Test Pusher connection | Test result |

### Example API Calls

```bash
# Health check
curl http://localhost:5000/api/upload/health

# Test Pusher
curl -X POST http://localhost:5000/api/upload/test-pusher

# Upload file
curl -X POST -F "file=@test.txt" -F "fileId=test-123" \
  http://localhost:5000/api/upload
```

## Testing the POC

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/upload/health
# Expected: {"status":"healthy",...}
```

### 2. Test Pusher Integration
```bash
curl -X POST http://localhost:5000/api/upload/test-pusher
```
Check the **Pusher Debug Console** - you should see the test event!

### 3. Test File Upload
1. Open React frontend (`http://localhost:3000`)
2. Click **"Generate Test File"**
3. Click **"Upload All"**
4. Watch real-time progress updates! 

### 4. Monitor Events

**Frontend Console (F12):**
```
✅ Connected to Pusher
📤 Uploading file: test-file-small-123.bin
📡 Received status update: {status: "in_progress", progress: 20}
📡 Received status update: {status: "completed", progress: 100}
```

**Backend Console:**
```
📤 Starting upload: test-file-small-123.bin (102400 bytes)
🚀 Triggering Pusher event: in_progress (20%)
✅ Pusher event sent successfully
✅ Upload completed: test-file-small-123.bin
```

**Pusher Dashboard:**
- Channel: `file-uploads`  
- Event: `upload-status`
- Real-time event data

## 🎨 UI Features

### File Size Options
- **Small (100KB)** - Quick testing
- **Medium (5MB)** - Standard files  
- **Large (20MB)** - Stress testing

### Status Indicators
- 🕒 **Pending** - File queued for upload
- 🔵 **In Progress (X%)** - Uploading with progress
- ✅ **Completed** - Upload successful
- ❌ **Failed** - Upload failed

## WebSocket Events

### Event Structure
```json
{
  "fileId": "test-file-small-123.bin-1234567890",
  "status": "in_progress",
  "progress": 65,
  "timestamp": "2026-01-23T18:30:00.000Z"
}
```

### Status Values
- `in_progress` - File is being uploaded (with progress %)
- `completed` - Upload finished successfully  
- `failed` - Upload encountered an error

## Troubleshooting

### Common Issues

**Pusher Not Connecting**
- ✅ Check credentials in both frontend and backend
- ✅ Verify cluster setting (`us2`, `eu`, etc.)
- ✅ Check browser console for errors

**Upload Failing**
- ✅ Ensure backend is running on `localhost:5000`
- ✅ Check CORS configuration
- ✅ Verify `uploads` folder permissions

**Progress Stuck at 0%**
- ✅ Check file ID matching in frontend
- ✅ Verify Pusher events are being sent
- ✅ Check frontend WebSocket connection

**No Events in Pusher Dashboard**
- ✅ Test with `/api/upload/test-pusher` endpoint
- ✅ Check backend logs for Pusher errors
- ✅ Verify all 4 Pusher credentials are correct

### Debug Commands

```bash
# Test backend health
curl http://localhost:5000/api/upload/health

# Test Pusher manually
curl -X POST http://localhost:5000/api/upload/test-pusher

# Check backend logs
dotnet run --verbosity detailed

# Check frontend console
# Open browser DevTools (F12) → Console
```

 ❤️ for learning WebSocket file upload patterns**
