import copyData from '@/database/copy'
import nc from 'next-connect'

const handler = nc()

handler.get(async (req, res) => {
    try {
        await copyData()
        res.status(200).send("success")
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

export default handler