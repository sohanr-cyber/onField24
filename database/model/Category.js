import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: {
        type: String,
        required: true
      },
      bn: {
        type: String,
        required: true
      }
    },
    slug: {
      // URL friendly identifier
      type: String,
      required: true,
      trim: true
      // unique: true // Ensures unique category URLs
    },

    image: {
      type: String
    },
    // Optional fields for hierarchical categories
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category' // Reference to itself for parent category
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // Reference to itself for child categories
      }
    ],
    isFeatured: {
      type: Boolean,
      default: false,
      required: true
    }
  },

  { timestamps: true }
)

// Create Model
const Category =
  mongoose.models.Category || mongoose.model('Category', categorySchema)
export default Category
