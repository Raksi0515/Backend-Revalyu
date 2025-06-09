
import Bottle from '../models/Bottle.js';


export const submitBottle = async (req, res) => {
  const { quantity, location } = req.body;
  const userId = req.user.id;

  try {
    const bottle = await Bottle.create({ userId, quantity, location });
    res.status(201).json(bottle);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting bottle' });
  }
};
export default submitBottle;

// // Get all bottles (admin)
export const getAllBottles = async (req, res) => {
  try {
    const bottles = await Bottle.find().populate('userId', 'name email');
    res.status(200).json({message: 'Bottles fetched successfully'});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bottles' });
  }
};



//  Edit
export const editBottle = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Bottle.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// // Delete
export const deleteBottle = async (req, res) => {
  const { id } = req.params;
  try {
    await Bottle.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
};


// Example controller file: bottleController.js

