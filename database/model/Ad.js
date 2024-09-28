const mongoose = require('mongoose')

const adSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    description: {
      en: { type: String, required: false },
      bn: { type: String, required: false }
    },
    image: {
      en: { type: String, required: true }, // English version of the ad image
      bn: { type: String, required: false } // Bengali version of the ad image (optional)
    },
    targetUrl: {
      type: String,
      required: true
    },
    targetText: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    adType: {
      type: String,
      enum: ['banner', 'video', 'sidebar', 'popup'], // Different ad formats
      required: true
    },
    impressions: {
      type: Number,
      default: 0
    },

    advertiser: {
      type: String
      // required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    targetAudience: {
      ageGroup: { type: String }, // e.g., '18-25', '25-35', etc.
      region: { type: String }, // e.g., 'Dhaka', 'Chittagong'
      language: { type: String, enum: ['en', 'bn'] } // Targeted language
    },
    clicks: {
      type: Number,
      default: 0
    },

  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
)

// Add an instance method to check if the ad is currently active based on the date range
adSchema.methods.isActiveAd = function () {
  const currentDate = new Date()
  return (
    this.isActive &&
    currentDate >= this.startDate &&
    currentDate <= this.endDate
  )
}

const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema)
export default Ad
