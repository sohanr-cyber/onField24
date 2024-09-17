import mongoose from 'mongoose'
import slugify from 'slugify'

// Define Schema
const articleSchema = new mongoose.Schema(
  {
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
    excerpt: {
      en: {
        type: String,
        required: true
      },
      bn: {
        type: String,
        required: true
      }
    },
    thumbnail: {
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
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    publishedAt: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number
    },
    updatedAt: {
      type: Date
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
)

// Pre-save hook to generate a unique 6-digit tracking number
articleSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title.en)
  }

  next()
})

const Article =
  mongoose.models.Article || mongoose.model('Article', articleSchema)
export default Article
