import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema(
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
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
)

const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema)
export default Tag
