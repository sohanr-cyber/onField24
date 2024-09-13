import db from '@/database/connection'
import Category from '@/database/model/Category'
import UserService from '@/services/user-service'
import { isAdmin, isAuth } from '@/utility'
import nextConnect from 'next-connect'
import slugify from 'slugify'
import Article from '@/database/model/Article'
const handler = nextConnect()
const PAGE_SIZE = 20

// handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  try {
    const { title, content, authorId, categoryIds, status } = req.body

    // Validate required fields
    if (!title || !content || !authorId || !categoryIds) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    await db.connect()
    
    // Validate that the author exists
    // const author = await User.findById(authorId)
    // if (!author) {
    //   return res.status(404).json({ message: 'Author not found' })
    // }

    // Validate that the categories exist
    // const categories = await Category.find({ _id: { $in: categoryIds } })
    // if (categories.length !== categoryIds.length) {
    //   return res.status(404).json({ message: 'Some categories not found' })
    // }

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
      author: authorId,
      //   categories: categoryIds,
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

export default handler
