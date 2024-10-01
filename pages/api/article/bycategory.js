import db from '@/database/connection'
import Category from '@/database/model/Category'
import Article from '@/database/model/Article'
import User from '@/database/model/User'
import nc from 'next-connect'
import { getPlaceholderImage } from '@/utility/image'
import { SUPPORTED_LANGUAGE } from '@/config'
import t from '@/utility/dict'

const handler = nc()

// Validate language query parameter
const validateLanguage = lang => SUPPORTED_LANGUAGE.includes(lang)

const fetchFeaturedCategories = async lang => {
  const categories = await Category.find({ isFeatured: true }).sort({
    updatedAt: -1
  })
  return Promise.all(
    categories.map(async category => {
      const articles = await Article.find({
        categories: { $in: category._id },
        status: 'published'
      })
        .sort({ publishedAt: -1 })
        .populate('categories', 'name')
        .limit(4)

      const subCategories = await Category.find({
        parent: category._id
      }).select('_id name')

      return {
        category: category.name[lang],
        _id: category._id,
        subCategories,
        updatedAt: category.updatedAt,
        articles: articles.map(article => ({
          _id: article._id,
          title: article.title[lang],
          thumbnail: article.thumbnail[lang],
          duration: article.duration,
          excerpt: article.excerpt[lang],
          slug: article.slug,
          categories: article.categories.map(cat => ({
            name: cat.name[lang]
          })),
          createdAt: article.createdAt,
          publishedAt: article.publishedAt
        }))
      }
    })
  )
}

const fetchFeaturedArticles = async lang => {
  const featuredArticles = await Article.find({
    isFeatured: true,
    status: 'published'
  })
    .populate('categories', 'name')
    .limit(9)
  return featuredArticles.map(article => ({
    _id: article._id,
    title: article.title[lang],
    thumbnail: article.thumbnail[lang],
    duration: article.duration,
    excerpt: article.excerpt[lang],
    slug: article.slug,
    categories: article.categories.map(cat => ({
      name: cat.name[lang]
    })),
    createdAt: article.createdAt,
    publishedAt: article.publishedAt
  }))
}

const fetchLatestArticles = async lang => {
  const latestArticles = await Article.find({ status: 'published' })
    .populate('categories', 'name')
    .populate('author', 'firstName lastName photo')
    .sort({ publishedAt: -1 })
    .limit(10)
  return latestArticles.map(article => ({
    _id: article._id,
    title: article.title[lang],
    thumbnail: article.thumbnail[lang],
    duration: article.duration,
    author: article.author,
    slug: article.slug,
    excerpt: article.excerpt[lang],
    categories: article.categories.map(cat => ({
      name: cat.name[lang]
    })),
    createdAt: article.createdAt,
    publishedAt: article.publishedAt
  }))
}

handler.get(async (req, res) => {
  const { lang = 'en' } = req.query

  if (!validateLanguage(lang)) {
    return res.status(400).json({
      message: 'Invalid language. Supported languages are en and bn.'
    })
  }

  try {
    await db.connect()
    const [featuredCategories, featuredArticles, latestArticles] =
      await Promise.all([
        fetchFeaturedCategories(lang),
        fetchFeaturedArticles(lang),
        fetchLatestArticles(lang)
      ])

    // await db.disconnect()

    return res
      .status(200)
      .json([
        { category: t('latest', lang), articles: latestArticles },
        { category: t('mustRead', lang), articles: featuredArticles },
        ...featuredCategories
      ])
  } catch (error) {
    console.error('Error fetching data:', error)
    await db.disconnect() // Ensure disconnection even on failure
    return res.status(500).json({ message: 'Server error' })
  }
})

export default handler
