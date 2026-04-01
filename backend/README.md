# NashZero Backend API

Production-ready Express.js backend for the NashZero sustainable building design platform.

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB 4.4+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment files
cp .env.example .env.dev
cp .env.example .env.stag
cp .env.example .env.prod
```

### Configuration

**Development (.env.dev):**
```bash
NODE_ENV=development
PORT=4000
DATABASE_URL=mongodb://localhost:27017/nashzero_dev
JWT_SECRET=dev_secret_key_here
JWT_EXPIRES_IN=7d
```

**Staging (.env.stag):**
```bash
NODE_ENV=staging
PORT=4000
DATABASE_URL=mongodb://staging-db:27017/nashzero_stag
JWT_SECRET=staging_secret_key_here
JWT_EXPIRES_IN=7d
```

**Production (.env.prod):**
```bash
NODE_ENV=production
PORT=4000
DATABASE_URL=mongodb://prod-db:27017/nashzero_prod
JWT_SECRET=production_secret_key_here
JWT_EXPIRES_IN=7d
```

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Staging mode
npm run start:stag

# Production mode
npm run start:prod

# Production (compiled)
npm start
```

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts         # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts   # Auth logic
│   │   ├── projectController.ts # Project CRUD
│   │   ├── buildingController.ts # Building CRUD
│   │   └── analysisController.ts # Analysis CRUD
│   ├── middleware/
│   │   └── auth.ts             # Authentication & error handling
│   ├── models/
│   │   ├── User.ts             # User schema
│   │   ├── Project.ts          # Project schema
│   │   ├── Building.ts         # Building schema
│   │   └── Analysis.ts         # Analysis schema
│   ├── routes/
│   │   ├── auth.ts             # /api/auth routes
│   │   ├── projects.ts         # /api/projects routes
│   │   ├── buildings.ts        # /api/projects/buildings routes
│   │   └── analysis.ts         # /api/projects/analysis routes
│   └── index.ts                # Main server file
├── .env.dev                    # Development environment
├── .env.stag                   # Staging environment
├── .env.prod                   # Production environment
├── .env.example                # Template
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── API_DOCUMENTATION.md        # Complete API docs
└── README.md                   # This file
```

---

## API Overview

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Buildings
- `POST /api/projects/:projectId/buildings` - Create building
- `GET /api/projects/:projectId/buildings` - Get buildings
- `PUT /api/projects/:projectId/buildings/:buildingId` - Update building
- `DELETE /api/projects/:projectId/buildings/:buildingId` - Delete building

### Analysis
- `POST /api/projects/:projectId/analysis` - Run analysis
- `GET /api/projects/:projectId/analysis` - Get all analyses
- `GET /api/projects/:projectId/analysis/:type` - Get analysis by type
- `DELETE /api/projects/:projectId/analysis/:analysisId` - Delete analysis

**Full API documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Key Features

✅ **JWT Authentication**
- Secure user registration & login
- Token-based authentication
- Password hashing with bcryptjs

✅ **Project Management**
- Create & manage projects
- Track site boundaries
- Store analysis results

✅ **3D Building Modeling**
- Box geometry support
- DXF file import support
- Custom geometry handling

✅ **Analysis Management**
- Energy analysis
- Solar analysis
- Daylight analysis
- Wind analysis
- Indoor air quality analysis

✅ **Authorization**
- User-specific project access
- Role-based access control
- Proper error handling

✅ **Database**
- MongoDB with Mongoose
- Proper schema design
- Indexing for performance

---

## Database Requirements

### MongoDB Setup

**Local Development:**
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod --dbpath /path/to/data

# Or with Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=nashzero_dev \
  mongo:latest
```

**Remote Database:**
- MongoDB Atlas (recommended for production)
- Configure DATABASE_URL in `.env` files

---

## Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Development
- `typescript` - TypeScript support
- `ts-node` - Run TypeScript files
- `nodemon` - Auto-reload on changes
- `@types/express` - TypeScript types
- `@types/node` - Node.js types

---

## Scripts

```bash
# Development
npm run dev          # Start with hot reload

# Production
npm run build        # Build TypeScript
npm start            # Run compiled code

# Environment-specific
npm run start:dev    # Start in dev mode
npm run start:stag   # Start in staging mode
npm run start:prod   # Start in production mode
```

---

## Error Handling

### Standard Error Response
```json
{
  "error": "Error description",
  "status": 400
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict
- `500` - Server error

---

## Security Features

✅ **Password Security**
- Bcryptjs hashing with salt rounds
- Never store plain passwords

✅ **JWT Tokens**
- Signed with secret
- Expiration time
- Bearer token validation

✅ **CORS**
- Restricted to frontend origins
- Configurable per environment

✅ **Input Validation**
- Request validation
- Email format checking
- Required field validation

✅ **Authorization**
- User ID verification
- Project ownership checks
- Resource-level access control

---

## Development Workflow

### 1. Start MongoDB
```bash
docker run -d -p 27017:27017 --name nashzero-db mongo:latest
```

### 2. Create Environment File
```bash
cp .env.example .env.dev
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test Endpoints
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get projects
curl -X GET http://localhost:4000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing the API

### Using cURL
```bash
# Health check
curl http://localhost:4000/health

# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

### Using Postman
1. Import API endpoints
2. Set `token` variable from login response
3. Use `{{token}}` in Authorization header
4. Test all endpoints

### Using Insomnia
- Similar workflow to Postman
- Better for complex request management

---

## Performance Optimization

### Implemented
- ✅ MongoDB indexing on frequently queried fields
- ✅ Lean queries where possible
- ✅ Proper error handling to prevent crashes
- ✅ Environment-based configuration

### Recommended for Production
- [ ] Add caching layer (Redis)
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring (Datadog, New Relic)
- [ ] Enable compression middleware
- [ ] Add request tracing

---

## Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

### Environment Secrets
- Store `JWT_SECRET` in secure vault
- Never commit `.env` files
- Use separate secrets per environment

### Scaling Considerations
- Load balance across multiple instances
- Use MongoDB replica sets
- Implement caching strategy
- Monitor performance metrics

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running
```bash
docker start nashzero-db
# or
mongod --dbpath /path/to/data
```

### Token Verification Failed
```
Error: Invalid or expired token
```
**Solution:** 
- Token may have expired
- JWT_SECRET mismatch
- Check token format (remove "Bearer " prefix)

### Port Already in Use
```
Error: listen EADDRINUSE :::4000
```
**Solution:** Change port or kill process
```bash
lsof -i :4000
kill -9 <PID>
# or change PORT in .env
```

---

## Contributing

1. Create feature branch
2. Follow TypeScript conventions
3. Add types to all functions
4. Test endpoints before submitting
5. Update API documentation if needed

---

## Support

For API issues or questions:
1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Review error messages
3. Check MongoDB logs
4. Enable debug mode

---

## License

Proprietary - NashZero Inc.

---

**Version:** 1.0.0  
**Last Updated:** January 2024

