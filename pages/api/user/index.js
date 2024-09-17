import User from '@/database/model/User'
import UserService from '@/services/user-service'
import { isAuth } from '@/utility'
import nextConnect from 'next-connect'

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

handler.get(async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(400)
  }
})

export default handler
