import { Router } from 'express';
import {
  createBuilding,
  getBuildingsByProject,
  updateBuilding,
  deleteBuilding,
} from '../controllers/buildingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/:projectId/buildings', createBuilding);
router.get('/:projectId/buildings', getBuildingsByProject);
router.put('/:projectId/buildings/:buildingId', updateBuilding);
router.delete('/:projectId/buildings/:buildingId', deleteBuilding);

export default router;
