import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import usersRouter from './routes/users'; // Import new users router
import modulesRouter from './routes/modules'; // Import new modules router
import mockTestsRouter from './routes/mockTests'; // Import new mock tests router
import rolesRouter from './routes/roles'; // Import new roles router
import certificationTracksRouter from './routes/certificationTracks'; // Import new certification tracks router
import leadsRouter from './routes/leads'; // Import new leads router

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('ET AI Ready Backend API is running!');
});

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Test database connection
    const { db } = await import('../db/config');
    await db.select().from(require('../db/schema').users).limit(1);
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/users', usersRouter); // Use new users router
app.use('/api/modules', modulesRouter); // Use new modules router
app.use('/api/mock-tests', mockTestsRouter); // Use new mock tests router
app.use('/api/roles', rolesRouter); // Use new roles router
app.use('/api/permissions', rolesRouter); // Permissions are also handled by roles router
app.use('/api/certification-tracks', certificationTracksRouter); // Use new certification tracks router
app.use('/api/leads', leadsRouter); // Use new leads router

app.listen(PORT, () => {
  // Server started
});
