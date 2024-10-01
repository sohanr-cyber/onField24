import nextConnect from 'next-connect'
import UserService from '@/services/user-service'
import { isAuth } from '@/utility'
import db from '@/database/connection'
import User from '@/database/model/User'
import Article from '@/database/model/Article'
import Tag from '@/database/model/Tag'

const handler = nextConnect()
// handler.use(isAuth)
handler.get(async (req, res) => {
  const {
    status,
    categories,
    tags,
    search,
    lang = 'en',
    page = 1,
    pageSize = 10
  } = req.query

  const authorId = req.query.id
  const supportedLangs = ['en', 'bn']
  if (!supportedLangs.includes(lang)) {
    return res.status(400).json({
      message: 'Invalid language. Supported languages are en and bn.'
    })
  }

  const filter = {}

  // Filter by status (draft or published)
  if (status) {
    filter.status = status
  }

  // Filter by author ID
  if (authorId) {
    filter.author = authorId
  }

  // Filter by category
  if (categories && categories != 'all') {
    filter.categories = { $in: categories.split(',') } // Filter products by category
  }

  // Filter by category
  if (tags && tags != 'all') {
    filter.tags = { $in: tags.split(',') } // Filter products by category
  }

  if (search) {
    filter.$or = [
      { [`title.${lang}`]: { $regex: search, $options: 'i' } }, // Search in title based on lang
      { [`content.${lang}`]: { $regex: search, $options: 'i' } } // Search in content based on lang
    ]
  }

  const skip = (page - 1) * pageSize

  try {
    await db.connect()
    const user = await User.findOne(
      { _id: req.query.id },
      {
        password: 0
      }
    ).lean()
    const articles = await Article.find(
      { ...filter },
      {
        content: 0,
        comment: 0,
        author: 0,
        excerpt: 0
      }
    )
      .populate('categories', 'name _id')
      .populate('tags', 'name _id')
      .skip(skip)
      .limit(Number(pageSize))
      .lean()

    const totalArticles = await Article.countDocuments(filter)
    const totalPublished = await Article.countDocuments({
      ...filter,
      status: 'published'
    })
    const totalDraft = await Article.countDocuments({
      ...filter,
      status: 'draft'
    })

    await db.disconnect()

    return res.status(200).json({
      ...user,
      message: 'Articles retrieved successfully',
      page: Number(page),
      totalPages: Math.ceil(totalArticles / pageSize),
      totalArticles,
      totalPublished,
      totalDraft,
      articles: articles.map(article => ({
        _id: article._id,
        slug: article.slug,
        title: article.title[lang],
        status: article.status,
        author: article.author,
        categories: article.categories.map(i => ({
          name: i.name[lang],
          _id: i._id
        })),
        tags: article.tags.map(i => ({
          name: i.name[lang],
          _id: i._id
        })),
        publishedAt: article.publishedAt,
        views: article.views,
        slug: article.slug,
        createdAt: article.createdAt
      }))
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

handler.put(async (req, res) => {
  try {
    const { id } = req.query // Get the article ID from the query parameters
    const { firstName, lastName, phone, address, facebook, whatsapp, photo } =
      req.body // Extract fields from the request body

    if (!firstName || (!lastName && !phone)) {
      return res.status(400).json({ message: 'No fields to update' })
    }

    await db.connect()

    const existing = await User.findOne({ _id: req.query.id })
    if (existing._id != req.user._id) {
      console.log('Invalid request ....')
      return res.status(200).send({ error: 'Invalid Request' })
    }
    // Find the article by ID and update it with new data
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName,
          lastName,
          phone,
          address,
          facebook,
          whatsapp,
          photo
        }
      },
      { new: true, runValidators: true }
    )

    await db.disconnect()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error })
  }
})
handler.delete(async (req, res) => {
  try {
    await db.connect()
    const result = await User.deleteOne({ _id: req.query.id })
    if (result) {
      res.status(200).json({ message: 'User Deleted !' })
    }
  } catch (error) {
    console.log(error)
  }
})

export default handler
