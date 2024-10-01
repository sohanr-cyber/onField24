// Import necessary modules and models
import { SUPPORTED_LANGUAGE } from '@/config'
import db from '@/database/connection'
import Category from '@/database/model/Category'
import nc from 'next-connect'
import slugify from 'slugify'
const PAGE_SIZE = 20
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
    // const page = parseInt(req.query.page) || 1

    // Calculate the skip value based on the page number and page size
    // const skip = (page - 1) * (req.query.pageSize || PAGE_SIZE)
    // Retrieve total count of products
    // const totalCount = await Category.countDocuments()

    // Calculate total pages
    // const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    // Retrieve products with pagination and sorting
    const categories = await Category.find({ parent: null })
    let tree = await Promise.all(
      categories.map(async item => {
        const { _id, name, updatedAt } = item
        const c = await Category.find({ parent: _id })

        const subtree = await Promise.all(
          c.map(async item => {
            const { _id, name } = item
            const sc = await Category.find({ parent: _id })
            return {
              name: name[lang],
              _id: _id,
              children: sc,
              updatedAt: updatedAt
            }
          })
        )

        return {
          name: name[lang],
          _id: _id,
          children: subtree,
          updatedAt: updatedAt
        }
      })
    )

    tree = tree.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    await db.disconnect()
    res.json(tree)
  } catch (error) {
    console.log({ error })
    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
