import db from '@/database/connection'
import Article from '@/database/model/Article'
import nc from 'next-connect'

const handler = nc()

handler.put(async (req, res) => {
  try {
    await db.connect()
    const article = await Article.findOne({ _id: req.body.id })
    if (article) {
      article.views = article.views || 0 + 1
      await article.save()
      console.log('view counted for ', article.title.en)
    }

    await db.disconnect()
    return res.status(200).send({ message: 'View Incremented ' })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'View Incremented '
    })
  }
})

handler.post(async (req, res) => {
  try {
    await db.connect()
    const article = await Article.findOne({ _id: req.body.id })
    if (article) {
      article.reads = article.reads || 0 + 1
      await article.save()
      console.log('read counted for ', article.title.en)
    }

    await db.disconnect()
    return res.status(200).send({ message: 'Read Incremented ' })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Read Incremented '
    })
  }
})

export default handler
