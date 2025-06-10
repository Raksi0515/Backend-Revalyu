import express from 'express';
import  {submitBottle ,getAllBottles ,editBottle , deleteBottle} from '../controllers/bottleController.js';
//import protect from '../middleware/authMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/submit', protect, submitBottle);
router.get('/', protect, getAllBottles);
router.put('/:id', protect, editBottle);
 router.delete('/:id', protect, deleteBottle);

export default router;

