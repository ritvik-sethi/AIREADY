import { Router } from 'express';
import { getUserCourseProgress, getUserMockTestResults } from '../controllers/authController';

const userRouter = Router();

userRouter.get('/:userId/course-progress', async (req, res) => {
  const userId = Number(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }
  try {
    const progress = await getUserCourseProgress(userId);
    res.json({ success: true, progress });
  } catch (error) {
    console.error('Error fetching user course progress via API:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

userRouter.get('/:userId/mock-tests', async (req, res) => {
  const userId = Number(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }
  try {
    const results = await getUserMockTestResults(userId);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error fetching user mock test results via API:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default userRouter;
