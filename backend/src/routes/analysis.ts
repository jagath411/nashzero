import { Router } from 'express';
import {
  runAnalysis,
  getAnalysis,
  getAnalysisByType,
  deleteAnalysis,
} from '../controllers/analysisController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/:projectId/analysis', runAnalysis);
router.get('/:projectId/analysis', getAnalysis);
router.get('/:projectId/analysis/:type', getAnalysisByType);
router.delete('/:projectId/analysis/:analysisId', deleteAnalysis);

export default router;
