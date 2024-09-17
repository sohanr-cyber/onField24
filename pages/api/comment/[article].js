// Import necessary modules and the Comment model
import nc from 'next-connect'

import Article from '@/database/model/Article'
import Comment from '@/database/model/Comment'
import db from '@/database/connection'
import User from '@/database/model/User'
// Initialize next-connect handler
const handler = nc()

// Connect to the database
db.connect()

// Create Comment API endpoint
handler.post(async (req, res) => {
  try {
    const { user, rating, content, attachments } = req.body
    const { article } = req.query
    // Check if the article exists (you should have a Article model and import it)
    const existingArticle = await Article.findOne({ _id: article })
    if (!existingArticle) {
      return res.status(404).json({ message: 'Article not found' })
    }

    // Create the comment
    const comment = await Comment.create({
      user,
      article,
      content
    })

    res.status(201).json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get All Comments API endpoint
handler.get(async (req, res) => {
  try {
    const { article: articleId } = req.query

    // Find all comments associated with the specified article
    const comments = await Comment.find({ article: articleId }).populate({
      path: 'user',
      select: '_id firstName'
    })

    res.status(200).json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get Single Comment API endpoint
handler.get(async (req, res) => {
  try {
    const { id } = req.query

    // Find the comment by its ID
    const comment = await Comment.findById(id)

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.status(200).json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Update Comment API endpoint
handler.put(async (req, res) => {
  try {
    const { id } = req.query
    const { rating, content, attachments } = req.body

    // Update the comment by its ID
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { rating, content, attachments },
      { new: true }
    )

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.status(200).json(updatedComment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Delete Comment API endpoint
handler.delete(async (req, res) => {
  try {
    const { id } = req.query

    // Delete the comment by its ID
    const deletedComment = await Comment.findByIdAndDelete(id)

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
