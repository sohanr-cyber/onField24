// Import necessary modules and models
import { SUPPORTED_LANGUAGE } from '@/config'
import db from '@/database/connection'
import Tag from '@/database/model/Tag'
import { isAdmin, isAuth } from '@/utility'
import nc from 'next-connect'
import slugify from 'slugify'
const PAGE_SIZE = 400
const handler = nc()
import urlSlug from 'url-slug'

function sortTagsByName (tags, lang) {
  return tags.sort((a, b) => a.name[lang].localeCompare(b.name[lang]))
}
// get all the category
handler.get(async (req, res) => {
  const { lang = 'en', name } = req.query
  const filter = {}

  if (name) {
    filter.$or = [
      { 'name.en': { $regex: name, $options: 'i' } }, // Search in English title
      { 'name.bn': { $regex: name, $options: 'i' } }
    ]
  }
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
    let tags = await Tag.find({ ...filter })
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)

    tags = sortTagsByName(tags, lang)

    await db.disconnect()
    res.json({ page, tags, totalPages })
  } catch (error) {
    console.log({ error })
    res.status(500).json({ message: 'Server Error' })
  }
})

handler.use(isAuth, isAdmin)
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

handler.patch(async (req, res) => {
  const tags = req.body.tags // expecting an array of tags like [{ en: "Science", bn: "বিজ্ঞান" }, ...]

  if (!Array.isArray(tags) || tags.length === 0) {
    return res
      .status(400)
      .json({ error: 'Invalid tags data. Expected a non-empty array.' })
  }
  try {
    await db.connect()
    const insertedTags = await Tag.insertMany(
      tags.map(i => ({
        name: i.name,
        slug: urlSlug(i.name.en)
      })),
      { ordered: false }
    )
    await db.disconnect()
    return res.status(201).json({
      message: 'Tags created successfully',
      tags: insertedTags
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'An error occurred while creating tags.' })
  }
})

export default handler
