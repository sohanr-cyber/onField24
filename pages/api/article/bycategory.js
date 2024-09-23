import db from '@/database/connection'
import Category from '@/database/model/Category'
import Article from '@/database/model/Article'
import nc from 'next-connect'
import { getPlaceholderImage } from '@/utility/image'
import { SUPPORTED_LANGUAGE } from '@/config'

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
        categories: { $in: category._id }
      })
        .sort({ publishedAt: -1 })
        .populate('categories', 'name')
        .limit(4)

      const subCategories = await Category.find({
        parent: category._id
      }).select('_id name')

      return {
        category: category.name[lang],
        subCategories,
        updatedAt: category.updatedAt,
        articles: articles.map(article => ({
          _id: article._id,
          title: article.title[lang],
          thumbnail: article.thumbnail[lang],
          duration: article.duration,
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
  const featuredArticles = await Article.find({ isFeatured: true })
    .populate('categories', 'name')
    .limit(9)
  return featuredArticles.map(article => ({
    _id: article._id,
    title: article.title[lang],
    thumbnail: article.thumbnail[lang],
    duration: article.duration,
    slug: article.slug,
    categories: article.categories.map(cat => ({
      name: cat.name[lang]
    })),
    createdAt: article.createdAt,
    publishedAt: article.publishedAt
  }))
}

const fetchLatestArticles = async lang => {
  const latestArticles = await Article.find({})
    .populate('categories', 'name')
    .sort({ publishedAt: -1 })
    .limit(10)
  return latestArticles.map(article => ({
    _id: article._id,
    title: article.title[lang],
    thumbnail: article.thumbnail[lang],
    duration: article.duration,
    slug: article.slug,
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

    await db.disconnect()

    return res
      .status(200)
      .json([
        { category: 'Latest', articles: latestArticles },
        { category: 'featured', articles: featuredArticles },
        ...featuredCategories
      ])
  } catch (error) {
    console.error('Error fetching data:', error)
    await db.disconnect() // Ensure disconnection even on failure
    return res.status(500).json({ message: 'Server error' })
  }
})

export default handler
