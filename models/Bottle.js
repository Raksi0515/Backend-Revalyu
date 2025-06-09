import mongoose from 'mongoose';

const bottleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bottleType: {
      type: String,
      required: [true, 'Please specify the type of bottle'],
    },
    weight: {
      type: Number,
      required: [true, 'Please provide the weight'],
    },
    points: {
      type: Number,
      required: [true, 'Please provide the bottle points'],
    },
    pickupStatus: {
      type: String,
      enum: ['requested', 'assigned', 'completed'],
      default: 'requested',
    },
  },
  {
    timestamps: true,
  }
);

const Bottle = mongoose.model('Bottle', bottleSchema);

export default Bottle;
