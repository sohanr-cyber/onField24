import db from '@/database/connection'
import Category from '@/database/model/Category'
import UserService from '@/services/user-service'
import { isAdmin, isAuth } from '@/utility'
import nextConnect from 'next-connect'
import slugify from 'slugify'
import Article from '@/database/model/Article'
import Tag from '@/database/model/Tag'
import { SUPPORTED_LANGUAGE } from '@/config'
const handler = nextConnect()
const PAGE_SIZE = 20

handler.get(async (req, res) => {
  try {
    const { lang = 'en' } = req.query

    // Validate the lang parameter (only allow 'en' or 'bn')

    if (!SUPPORTED_LANGUAGE.includes(lang)) {
      return res.status(400).json({
        message: 'Invalid language. Supported languages are en and bn.'
      })
    }

    await db.connect()
    // Query the articles based on the filter and pagination
    const article = await Article.findOne({
      slug: req.query.slug
    })
      .populate('author', 'name email') // Populate author info
      .populate('categories', 'name')
      .populate('tags', 'name') // Populate category info

    console.log(article)
    if (!article) {
      res.status(404).json({ message: 'Not Found' })
    }

    // Map over articles to return only the selected language fields for title and content
    const localizedArticle = {
      _id: article._id,
      title: article.title[lang], // Return title in the selected language
      content: article.content[lang], // Return content in the selected language
      thumbnail: article.thumbnail[lang],
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
    }

    res.status(200).json(localizedArticle)
  } catch (error) {
    console.error('Error retrieving articles:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

export default handler
