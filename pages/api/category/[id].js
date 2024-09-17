// Import necessary modules and models
import db from '@/database/connection'
import Category from '@/database/model/Category'
import { isAdmin, isAuth } from '@/utility'
import nc from 'next-connect'
import slugify from 'slugify'

const handler = nc()

// Get category by ID
handler.get(async (req, res) => {
  try {
    const { id } = req.query
    await db.connect()
    const category = await Category.findById(id).populate({
      path: 'children'
    })
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(200).json(category)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// handler.use(isAuth, isAdmin)
// Update category by ID
handler.put(async (req, res) => {
  console.log(req.body)

  try {
    const { id } = req.query
    await db.connect()
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { ...req.body, slug: slugify(req.body.name.en) },
      {
        new: true
      }
    )
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }
    const category = await Category.findById(id).populate({
      path: 'children'
    })

    await db.disconnect()

    res.status(200).json(category)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Delete category by ID
handler.delete(async (req, res) => {
  try {
    const { id } = req.query
    await db.connect()
    const deletedCategory = await Category.findByIdAndDelete(id)
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }
    await db.disconnect()
    return res.status(200).json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Add Child Category
handler.post(async (req, res) => {
  try {
    const { name } = req.body
    const { id: parentCategoryId } = req.query

    // Find the parent category by ID
    const parentCategory = await Category.findById(parentCategoryId)

    if (!parentCategory) {
      return res.status(404).json({ message: 'Parent category not found' })
    }

    // Create the child category
    const childCategory = new Category({ name, slug: slugify(name) })

    // Save the child category
    await childCategory.save()

    // Add the child category to the parent category's children array
    parentCategory.children.push(childCategory._id)
    await parentCategory.save()

    res.status(201).json(childCategory)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
