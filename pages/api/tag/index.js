// Import necessary modules and models
import { SUPPORTED_LANGUAGE } from '@/config'
import db from '@/database/connection'
import Tag from '@/database/model/Tag'
import { isAdmin, isAuth } from '@/utility'
import nc from 'next-connect'
import slugify from 'slugify'
const PAGE_SIZE = 200
const handler = nc()

// get all the category
handler.get(async (req, res) => {
  const { lang = 'en' } = req.query
  // Validate the lang parameter (only allow 'en' or 'bn')
  if (!SUPPORTED_LANGUAGE.includes(lang)) {
    return res.status(400).json({
      message: 'Invalid language. Supported languages are en and bn.'
    })
  }
  try {
    await db.connect()
    // Get the page number from the query parameters, default to 1
    const page = parseInt(req.query.page) || 1

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * (req.query.pageSize || PAGE_SIZE)
    // Retrieve total count of products
    const totalCount = await Tag.countDocuments()

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    // Retrieve products with pagination and sorting
    let tags = await Tag.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)

    tags = tags.map(i => ({
      name: i.name,
      _id: i._id
    }))

    await db.disconnect()
    res.json({ page, tags, totalPages })
  } catch (error) {
    console.log({ error })
    res.status(500).json({ message: 'Server Error' })
  }
})

// handler.use(isAuth, isAdmin)
// Create a new category
handler.post(async (req, res) => {
  try {
    const { name } = req.body

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    await db.connect()

    const newTag = new Tag({
      name: {
        en: name.en,
        bn: name.bn
      },
      slug: slugify(name.en)
    })

    // Save the article to the database
    const savedTag = await newTag.save()

    res.status(201).json({
      message: 'Tag created successfully',
      article: savedTag
    })
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default handler
