import mongoose from 'mongoose'

// Define Schema
const articleSchema = new mongoose.Schema({
  title: {
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
  },
  content: {
    en: {
      type: String,
      required: true
    },
    bn: {
      type: String,
      required: true
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // required: true
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  }
})

const Article =
  mongoose.models.Article || mongoose.model('Article', articleSchema)
export default Article
