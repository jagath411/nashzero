import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler, authMiddleware } from './middleware/auth';

// Routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import buildingRoutes from './routes/buildings';
import analysisRoutes from './routes/analysis';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', buildingRoutes);
app.use('/api/projects', analysisRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Listen on port
    app.listen(port, () => {
      console.log(`
╔════════════════════════════════════════╗
║          NashZero API Server            ║
║                                          ║
║  🚀 Server running on http://localhost:${port}
║  📊 Connected to MongoDB                 ║
║  🔐 JWT Authentication enabled           ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
