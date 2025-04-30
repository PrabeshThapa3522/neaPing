import mongoose from 'mongoose';

const serverSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    provinceId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'issues'],
      default: 'offline',
    },
    lastChecked: {
      type: Date,
      default: null,
    },
    responseTime: {
      type: Number,
      default: null,
    },
    packetLoss: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Server = mongoose.model('Server', serverSchema);

export default Server;