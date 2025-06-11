import express from 'express';
import  {submitBottle ,getAllBottles ,updateBottle , deleteBottle} from '../controllers/bottleController.js';
//import protect from '../middleware/authMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
// import Bottel from '../models/bottle.js'; // Assuming you have a Bottle model


const router = express.Router();

// router.post('/,submit', protect, submitBottle);
// router.post('/', submitBottle);
// router.post('/', protect, submitBottle);
// router.post('/', submitBottle);
router.post('/', protect, submitBottle); 

router.get('/', protect, getAllBottles);
 router.put('/:id', protect, updateBottle);
 router.delete('/:id', protect, deleteBottle);
 

export default router;

