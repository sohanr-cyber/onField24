import nextConnect from 'next-connect'
import UserService from '@/services/user-service'
import { isAdmin, isAuth } from '@/utility'
import db from '@/database/connection'
import User from '@/database/model/User'
import Article from '@/database/model/Article'
import Tag from '@/database/model/Tag'

const handler = nextConnect()

handler.use(isAuth, isAdmin)
handler.put(async (req, res) => {
  try {
    const { role, id } = req.body // Extract fields from the request body

    if (!role) {
      return res.status(400).json({ message: 'No fields to update' })
    }

    await db.connect()

    // Find the article by ID and update it with new data
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          role
        }
      },
      { new: true, runValidators: true }
    )

    await db.disconnect()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error })
  }
})

export default handler
