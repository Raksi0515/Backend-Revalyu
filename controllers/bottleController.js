
import Bottle from '../models/Bottle.js';


export const submitBottle = async (req, res) => {
  const { weight, bottleType } = req.body;

  // Check if user is logged in
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized - user not found' });
  }

  try {
    const bottle = await Bottle.create({
      user: req.user.id,
      weight,
      bottleType,
    });

    res.status(201).json({ message: 'Bottle submitted successfully', bottle });
  } catch (error) {
    console.error('Submit bottle error:',error);
    res.status(500).json({ message: 'Error submitting bottle', error: error.message });
  }
};

export default submitBottle;


// // Get all bottles (admin)
// 
export const getAllBottles = async (req, res) => {
  try {
    const bottles = await Bottle.find().populate('user', 'name email');  // use 'user' if your schema defines 'user'
    res.status(200).json({ message: 'Bottles fetched successfully', bottles });
  } catch (err) {
    console.error('Error fetching bottles:', err);
    res.status(500).json({ message: 'Error fetching bottles' });
  }
};


//  Edit
export const updateBottle = async (req, res) => {
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





