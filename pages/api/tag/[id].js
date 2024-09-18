// Import necessary modules and models
import db from '@/database/connection'
import Tag from '@/database/model/Tag'
import { isAdmin, isAuth } from '@/utility'
import nc from 'next-connect'
import slugify from 'slugify'

const handler = nc()

// Get tag by ID
handler.get(async (req, res) => {
  try {
    const { id } = req.query
    await db.connect()
    const tag = await Tag.findById(id)
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    res.status(200).json(tag)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// handler.use(isAuth, isAdmin)
// Update tag by ID
handler.put(async (req, res) => {

  try {
    const { id } = req.query
    await db.connect()
    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { ...req.body, slug: slugify(req.body.name.en) },
      {
        new: true
      }
    )
    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    const tag = await Tag.findById(id)
    await db.disconnect()

    res.status(200).json(tag)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Delete tag by ID
handler.delete(async (req, res) => {
  try {
    const { id } = req.query
    await db.connect()
    const deletedTag = await Tag.findByIdAndDelete(id)
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    await db.disconnect()
    return res.status(200).json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Add Child Tag
handler.post(async (req, res) => {
  try {
    const { name } = req.body
    const { id: parentTagId } = req.query

    // Find the parent tag by ID
    const parentTag = await Tag.findById(parentTagId)

    if (!parentTag) {
      return res.status(404).json({ message: 'Parent tag not found' })
    }

    // Create the child tag
    const childTag = new Tag({ name, slug: slugify(name) })

    // Save the child tag
    await childTag.save()

    // Add the child tag to the parent tag's children array
    parentTag.children.push(childTag._id)
    await parentTag.save()

    res.status(201).json(childTag)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
