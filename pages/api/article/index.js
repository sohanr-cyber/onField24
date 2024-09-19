import db from '@/database/connection'
import Category from '@/database/model/Category'
import UserService from '@/services/user-service'
import { isAdmin, isAdminOrEditor, isAuth } from '@/utility'
import nextConnect from 'next-connect'
import slugify from 'slugify'
import Article from '@/database/model/Article'
import Tag from '@/database/model/Tag'
import { calculateReadingTimeFromHTML } from '@/utility/helper'
import User from '@/database/model/User'
const handler = nextConnect()

function sortArrayByKey (arr, key, order = 'asc') {
  if (!Array.isArray(arr) || arr.length === 0) {
    return []
  }

  // Determine if the key is numeric or date to handle sorting accordingly
  const isNumericKey = typeof arr[0][key] === 'number'
  const isDateKey =
    !isNumericKey &&
    new Date(arr[0][key]) !== 'Invalid Date' &&
    !isNaN(new Date(arr[0][key]))

  return arr.sort((a, b) => {
    let comparison = 0

    if (isNumericKey) {
      comparison = a[key] - b[key]
    } else if (isDateKey) {
      comparison = new Date(a[key]) - new Date(b[key])
    } else {
      if (a[key] < b[key]) comparison = -1
      if (a[key] > b[key]) comparison = 1
    }

    return order === 'desc' ? -comparison : comparison
  })
}

handler.get(async (req, res) => {
  try {
    const {
      status,
      authorId,
      categories,
      tags,
      search,
      lang = 'en',
      page = 1,
      limit = 10,
      sortBy,
      sortOrder
    } = req.query

    const supportedLangs = ['en', 'bn']
    if (!supportedLangs.includes(lang)) {
      return res.status(400).json({
        message: 'Invalid language. Supported languages are en and bn.'
      })
    }

    const filter = {}

    if (status) {
      filter.status = status
    }

    if (authorId) {
      filter.author = authorId
    }

    if (categories && categories != 'all') {
      filter.categories = { $in: categories.split(',') } // Filter articles by category
    }

    // Filter by category
    if (tags && tags != 'all') {
      filter.tags = { $in: tags.split(',') } // Filter articles by category
    }

    // Search in both English and Bengali fields of title and content
    // if (search) {
    //   filter.$or = [
    //     { 'title.en': { $regex: search, $options: 'i' } }, // Search in English title
    //     { 'title.bn': { $regex: search, $options: 'i' } }, // Search in Bengali title
    //     { 'content.en': { $regex: search, $options: 'i' } }, // Search in English content
    //     { 'content.bn': { $regex: search, $options: 'i' } } // Search in Bengali content
    //   ]
    // }

    // Handle text search in the selected language (lang)
    if (search) {
      filter.$or = [
        { [`title.${lang}`]: { $regex: search, $options: 'i' } }, // Search in title based on lang
        { [`content.${lang}`]: { $regex: search, $options: 'i' } } // Search in content based on lang
      ]
    }

    // Pagination settings (skip and limit)
    const skip = (page - 1) * limit
    await db.connect()
    // Query the articles based on the filter and pagination
    let articles = await Article.find(filter)
      .populate('author', 'name email') // Populate author info
      .populate('categories', 'name')
      // .populate('tags', 'name') // Populate category info

      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    if (sortBy && sortOrder) {
      console.log({ sortBy, sortOrder })
      if (sortOrder === 'desc') {
        articles = sortArrayByKey(articles, sortBy, 'desc')
      } else {
        articles = sortArrayByKey(articles, sortBy, 'asc')
      }
    }

    // Map over articles to return only the selected language fields for title and content
    const localizedArticles = articles.map(article => ({
      _id: article._id,
      slug: article.slug,
      title: article.title[lang], // Return title in the selected language
      // content: article.content[lang], // Return content in the selected language
      status: article.status,
      author: article.author,
      thumbnail: article.thumbnail[lang],
      excerpt: article.excerpt[lang],
      categories: article.categories.map(i => ({
        _id: i._id,
        name: i.name[lang]
      })),
      publishedAt: article.publishedAt,
      views: article.views,
      duration: article.duration
    }))

    const totalArticles = await Article.countDocuments(filter)

    res.status(200).json({
      message: 'Articles retrieved successfully',
      page: Number(page),
      totalPages: Math.ceil(totalArticles / limit),
      totalArticles,
      articles: localizedArticles
    })
  } catch (error) {
    console.error('Error retrieving articles:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

handler.use(isAuth, isAdminOrEditor)
handler.post(async (req, res) => {
  try {
    const { title, content, categories, status, thumbnail, tags, excerpt } =
      req.body
    const authorId = req.user._id
    console.log({ excerpt })
    // Validate required fields
    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    await db.connect()

    // Validate that the author exists
    const author = await User.findById(authorId)
    if (!author) {
      return res.status(404).json({ message: 'Author not found' })
    }

    // Validate that the categories exist
    const categoryIds = await Category.find({ _id: { $in: categories } })
    if (categories.length !== categoryIds.length) {
      return res.status(404).json({ message: 'Some categories not found' })
    }

    const existing = await Article.findOne({ slug: slugify(title.en) })
    if (existing) {
      return res
        .status(304)
        .json({ message: 'Already Exist A Article with this slug .' })
    }

    // Create a new article
    const newArticle = new Article({
      title: {
        en: title.en,
        bn: title.bn
      },
      content: {
        en: content.en,
        bn: content.bn
      },
      excerpt,
      tags,
      thumbnail,
      author,
      duration: calculateReadingTimeFromHTML(content.en || content.bn),
      //   author: authorId,
      categories: categories,
      slug: slugify(title.en),
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null
    })

    // Save the article to the database
    const savedArticle = await newArticle.save()

    res.status(201).json({
      message: 'Article created successfully',
      article: savedArticle
    })
  } catch (error) {
    console.error('Error creating article:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

handler.use(isAdmin)
handler.delete(async (req, res) => {
  try {
    await db.connect()
    // Find the article by ID and delete it
    const article = await Article.findByIdAndDelete(req.query.id)
    await db.disconnect()

    // Check if the article was found and deleted
    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    // Respond with a success message
    res.status(200).json({ message: 'Article deleted successfully' })
  } catch (error) {
    // Handle any errors that occur during the deletion process
    res.status(500).json({ message: 'Server error', error })
  }
})

export default handler
