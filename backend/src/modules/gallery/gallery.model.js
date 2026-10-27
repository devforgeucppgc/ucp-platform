
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: '',
    },

    eventDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ society: 1, createdAt: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);