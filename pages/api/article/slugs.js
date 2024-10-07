import db from '@/database/connection'
import Article from '@/database/model/Article'
import nextConnect from 'next-connect'

const handler = nextConnect()

handler.get(async (req, res) => {
  try {
    await db.connect()
    const articles = await Article.find(
      {},
      { slug: 1, _id: 1, publishedAt: 1 }
    ).lean() // Select only the slug field
    // const slugs = articles.map(article => article.slug) // Extract slugs from articles
    await db.disconnect()
    return res.status(200).json(articles) // Return only the slugs
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
