import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true
    },

    // Textual content of the comment
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', commentSchema)
export default Comment
