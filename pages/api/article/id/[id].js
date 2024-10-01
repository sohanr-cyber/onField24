import db from '@/database/connection'
import Category from '@/database/model/Category'
import { isAdmin, isAdminOrEditor, isAuth } from '@/utility'
import nextConnect from 'next-connect'
import slugify from 'slugify'
import Article from '@/database/model/Article'
import Tag from '@/database/model/Tag'
import { SUPPORTED_LANGUAGE } from '@/config'
import { calculateReadingTimeFromHTML } from '@/utility/helper'
const handler = nextConnect()

// handler.use(isAuth, isAdmin)
handler.get(async (req, res) => {
  try {
    await db.connect()
    // Query the articles based on the filter and pagination
    const article = await Article.findOne({
      _id: req.query.id
    })
      .populate('author', 'name email') // Populate author info
      .populate('categories', 'name _id')
    // Populate category info

    console.log(article)
    if (!article) {
      res.status(404).json({ message: 'Not Found' })
    }

    // Map over articles to return only the selected language fields for title and content

    res.status(200).json(article)
  } catch (error) {
    console.error('Error retrieving articles:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

handler.use(isAuth, isAdminOrEditor)
handler.put(async (req, res) => {
  try {
    const { id } = req.query // Get the article ID from the query parameters
    let {
      title,
      content,
      status,
      categories,
      tags,
      thumbnail,
      excerpt,
      publishedAt,
      isFeatured
    } = req.body // Extract fields from the request body
    publishedAt = publishedAt ? new Date(publishedAt) : new Date() // Set default if null or undefined

    console.log({ publishedAt })
    // console.log({ content })
    // Validate required fields
    if (!title && !content) {
      return res.status(400).json({ message: 'No fields to update' })
    }
    await db.connect()

    // Find the article by ID and update it with new data
    const article = await Article.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          content,
          slug: slugify(title.en),
          status,
          categories,
          excerpt,
          publishedAt,
          tags,
          thumbnail,
          isFeatured,
          duration: calculateReadingTimeFromHTML(content.en || content.bn)
        }
      },
      { new: true, runValidators: true }
    )

    // Check if the article was found and updated
    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    // Respond with the updated article
    res.status(200).json(article)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error })
  }
})

export default handler
