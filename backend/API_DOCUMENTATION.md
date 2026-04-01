# NashZero Backend API Documentation

## Overview
RESTful API for the NashZero sustainable building design platform. Handles user authentication, project management, building data, and analysis results.

**Base URL:** `http://localhost:4000/api`  
**Node Version:** 14+  
**Runtime:** Express.js with TypeScript

---

## Table of Contents
1. [Authentication](#authentication)
2. [Projects](#projects)
3. [Buildings](#buildings)
4. [Analysis](#analysis)
5. [Error Handling](#error-handling)

---

## Authentication

### Register
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `400` - Missing required fields
- `409` - User already exists

---

### Login
Authenticate user and get JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### Get Current User
Retrieve authenticated user information.

**Endpoint:** `GET /api/auth/me`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `401` - No token provided / Invalid token
- `404` - User not found

---

## Projects

All project endpoints require authentication.

### Create Project
Create a new project with site boundary.

**Endpoint:** `POST /api/projects`

**Headers Required:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Downtown Tower",
  "description": "Sustainable development in Dubai",
  "location": "Dubai, UAE",
  "site": {
    "coordinates": [
      [25.1972, 55.2744],
      [25.1978, 55.2750],
      [25.1968, 55.2755],
      [25.1962, 55.2749]
    ],
    "center": [25.1970, 55.2749],
    "area": 3200
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "project": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Downtown Tower",
    "description": "Sustainable development in Dubai",
    "userId": "507f1f77bcf86cd799439012",
    "location": "Dubai, UAE",
    "site": {
      "coordinates": [[25.1972, 55.2744], ...],
      "center": [25.1970, 55.2749],
      "area": 3200
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400` - Missing required fields
- `401` - Unauthorized

---

### Get All Projects
Retrieve all projects for authenticated user.

**Endpoint:** `GET /api/projects`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `skip` (optional): Number of projects to skip (default: 0)
- `limit` (optional): Max projects to return (default: 20)

**Response (200):**
```json
{
  "success": true,
  "projects": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Downtown Tower",
      "location": "Dubai, UAE",
      "site": { ... },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Project by ID
Retrieve specific project details.

**Endpoint:** `GET /api/projects/{projectId}`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "project": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Downtown Tower",
    "site": { ... },
    "analysis": {
      "energyEUI": 82,
      "peakCooling": 185,
      "daylightFactor": 5.2
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `404` - Project not found
- `403` - Unauthorized access

---

### Update Project
Update project details including analysis results.

**Endpoint:** `PUT /api/projects/{projectId}`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Downtown Tower (Updated)",
  "description": "Updated description",
  "analysis": {
    "energyEUI": 82,
    "peakCooling": 185,
    "peakHeating": 42,
    "pvOffset": 64,
    "daylightFactor": 5.2,
    "udi": 78,
    "sdi": 72,
    "windSpeed": 3.8,
    "temperature": 25.6
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "project": { ... }
}
```

---

### Delete Project
Permanently delete a project.

**Endpoint:** `DELETE /api/projects/{projectId}`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted"
}
```

---

## Buildings

All building endpoints require authentication and project ownership.

### Create Building
Add a building to a project.

**Endpoint:** `POST /api/projects/{projectId}/buildings`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Tower A",
  "type": "box",
  "position": [0, 0, 0],
  "dimensions": [8, 24, 8],
  "color": "#93c5fd"
}
```

**Alternative for DXF:**
```json
{
  "name": "Imported Floor Plan",
  "type": "dxf",
  "position": [-5, 0, -5],
  "color": "#64748b",
  "dxfUrl": "https://storage.example.com/floorplan.dxf",
  "geometry": { ... }
}
```

**Response (201):**
```json
{
  "success": true,
  "building": {
    "id": "507f1f77bcf86cd799439013",
    "projectId": "507f1f77bcf86cd799439011",
    "name": "Tower A",
    "type": "box",
    "position": [0, 0, 0],
    "dimensions": [8, 24, 8],
    "color": "#93c5fd",
    "createdAt": "2024-01-15T11:30:00Z"
  }
}
```

---

### Get Buildings by Project
List all buildings in a project.

**Endpoint:** `GET /api/projects/{projectId}/buildings`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "buildings": [
    {
      "id": "507f1f77bcf86cd799439013",
      "projectId": "507f1f77bcf86cd799439011",
      "name": "Tower A",
      "type": "box",
      "position": [0, 0, 0],
      "dimensions": [8, 24, 8],
      "color": "#93c5fd",
      "createdAt": "2024-01-15T11:30:00Z"
    }
  ]
}
```

---

### Update Building
Modify building properties.

**Endpoint:** `PUT /api/projects/{projectId}/buildings/{buildingId}`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Tower A (Updated)",
  "position": [1, 0, 1],
  "dimensions": [10, 26, 10]
}
```

**Response (200):**
```json
{
  "success": true,
  "building": { ... }
}
```

---

### Delete Building
Remove a building from project.

**Endpoint:** `DELETE /api/projects/{projectId}/buildings/{buildingId}`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Building deleted"
}
```

---

## Analysis

All analysis endpoints require authentication and project ownership.

### Run Analysis
Create analysis results for a project.

**Endpoint:** `POST /api/projects/{projectId}/analysis`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "analysisType": "energy",
  "buildingId": "507f1f77bcf86cd799439013",
  "metrics": [
    {
      "type": "energy",
      "value": 82,
      "unit": "kWh/m²",
      "timestamp": "2024-01-15T12:00:00Z",
      "details": {
        "cooling": 42,
        "heating": 8,
        "lighting": 18,
        "equipment": 22,
        "dhw": 6,
        "fans": 4
      }
    }
  ],
  "summary": {
    "energyEUI": 82,
    "peakCooling": 185,
    "peakHeating": 42,
    "pvOffset": 64
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "analysis": {
    "id": "507f1f77bcf86cd799439014",
    "projectId": "507f1f77bcf86cd799439011",
    "analysisType": "energy",
    "metrics": [ ... ],
    "summary": { ... },
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### Get All Analysis
Retrieve all analyses for a project.

**Endpoint:** `GET /api/projects/{projectId}/analysis`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "analyses": [
    {
      "id": "507f1f77bcf86cd799439014",
      "projectId": "507f1f77bcf86cd799439011",
      "analysisType": "energy",
      "metrics": [ ... ],
      "createdAt": "2024-01-15T12:00:00Z"
    },
    {
      "id": "507f1f77bcf86cd799439015",
      "projectId": "507f1f77bcf86cd799439011",
      "analysisType": "daylight",
      "metrics": [ ... ],
      "createdAt": "2024-01-15T13:00:00Z"
    }
  ]
}
```

---

### Get Analysis by Type
Get latest analysis of specific type.

**Endpoint:** `GET /api/projects/{projectId}/analysis/{type}`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Types:** `energy`, `solar`, `daylight`, `wind`, `indoor-air`

**Response (200):**
```json
{
  "success": true,
  "analysis": {
    "id": "507f1f77bcf86cd799439014",
    "projectId": "507f1f77bcf86cd799439011",
    "analysisType": "energy",
    "metrics": [ ... ],
    "summary": { ... },
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

**Errors:**
- `404` - No analysis found for type

---

### Delete Analysis
Remove analysis results.

**Endpoint:** `DELETE /api/projects/{projectId}/analysis/{analysisId}`

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Analysis deleted"
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message describing what went wrong",
  "details": "Additional context (optional)"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (no access to resource) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |

### Error Examples

**Missing Token:**
```
Status: 401
{
  "error": "No token provided"
}
```

**Invalid Token:**
```
Status: 401
{
  "error": "Invalid or expired token"
}
```

**Resource Not Found:**
```
Status: 404
{
  "error": "Project not found"
}
```

**Authorization Failed:**
```
Status: 403
{
  "error": "Unauthorized"
}
```

---

## Authentication Flow

1. **Register/Login**: Get JWT token
   ```bash
   curl -X POST http://localhost:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John","email":"john@example.com","password":"pass123"}'
   ```

2. **Save Token**: Store token in `localStorage`
   ```javascript
   localStorage.setItem("nzbd_token", token);
   ```

3. **Use in Requests**: Include in Authorization header
   ```bash
   curl -X GET http://localhost:4000/api/projects \
     -H "Authorization: Bearer {token}"
   ```

---

## Database Models

### User
- `id`: ObjectId (Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Project
- `id`: ObjectId
- `name`: String
- `description`: String
- `userId`: ObjectId (Foreign Key)
- `location`: String
- `site`: Object (coordinates, center, area)
- `analysis`: Object (analysis results)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Building
- `id`: ObjectId
- `projectId`: ObjectId (Foreign Key)
- `name`: String
- `type`: Enum (box, dxf, custom)
- `position`: [x, y, z]
- `dimensions`: [width, height, depth]
- `color`: String (hex)
- `dxfUrl`: String
- `geometry`: Mixed (3D geometry data)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Analysis
- `id`: ObjectId
- `projectId`: ObjectId (Foreign Key)
- `buildingId`: ObjectId (Optional)
- `analysisType`: Enum (energy, solar, daylight, wind, indoor-air)
- `metrics`: Array of analysis metrics
- `summary`: Object (summary results)
- `createdAt`: DateTime
- `updatedAt`: DateTime

---

## Environment Variables

```bash
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/nashzero

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

---

## Development

### Start Server (Dev Mode)
```bash
npm run dev
```

### Start Server (Production)
```bash
npm start
```

### Build TypeScript
```bash
npm run build
```

---

## CORS Configuration

Allowed Origins:
- `http://localhost:8080` (development)
- `http://localhost:3000` (alternate)
- Configure in production

---

## Rate Limiting

Currently not implemented. Consider adding for production.

---

## API Version

**Current Version:** 1.0.0  
**Last Updated:** January 2024
