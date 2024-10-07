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
    const { query, pageSize = PAGE_SIZE, lang = 'en' } = req.query

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize
    const filter = {}

    // Build the filter conditions for the shippingUser
    if (query) {
      filter.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { firstNameBn: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { lastNameBn: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }

    // console.log(addressFilter)

    const totalCount = await User.countDocuments(filter)

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize)

    // Perform the query with population and filtering
    let users = await User.find(filter)
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)

    users = users.map(user => ({
      ...user,
      firstName: lang == 'en' ? user.firstName : user?.firstNameBn,
      lastName: lang == 'en' ? user.lastName : user?.lastNameBn
    }))
    // console.log({ users, totalPages, totalCount })
    await db.disconnect()
    return res.status(200).json({ page, totalPages, count: totalCount, users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
