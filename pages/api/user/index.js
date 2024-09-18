import db from '@/database/connection'
import User from '@/database/model/User'
import UserService from '@/services/user-service'
import { isAuth } from '@/utility'
import nextConnect from 'next-connect'
const PAGE_SIZE = 20
const handler = nextConnect()

handler.post(async (req, res) => {
  try {
    const service = new UserService()
    const { email, password, firstName, lastName } = req.body
    const user = await service.SignUp({ email, password, firstName, lastName })
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(400)
  }
})

// handler.use(isAuth, isAdmin)
handler.get(async (req, res) => {
  try {
    await db.connect()
    const page = parseInt(req.query.page) || 1
    const { query, pageSize = PAGE_SIZE } = req.query

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize
    const filter = {}

    // Build the filter conditions for the shippingUser
    if (query) {
      filter.$or = [
        { fullName: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }

    // console.log(addressFilter)

    const totalCount = await User.countDocuments(filter)

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize)

    // Perform the query with population and filtering
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)

    // console.log({ users, totalPages, totalCount })
    await db.disconnect()
    return res.status(200).json({ page, totalPages, count: totalCount, users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
