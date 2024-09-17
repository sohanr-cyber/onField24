import db from '@/database/connection'
import Category from '@/database/model/Category'
import Article from '@/database/model/Article'
import nc from 'next-connect'
import { getPlaceholderImage } from '@/utility/image'
import { SUPPORTED_LANGUAGE } from '@/config'

const handler = nc()

handler.get(async (req, res) => {
  const { lang = 'en' } = req.query

  // Validate the lang parameter (only allow 'en' or 'bn')

  if (!SUPPORTED_LANGUAGE.includes(lang)) {
    return res.status(400).json({
      message: 'Invalid language. Supported languages are en and bn.'
    })
  }
  try {
    await db.connect()

    const fc = await Category.find({ isFeatured: true }).sort({ updatedAt: -1 })

    const pfc = await Promise.all(
      fc.map(async item => {
        const articles = await Article.find({
          categories: { $in: item._id }
        }).populate('categories', 'name')

        // const articlesWithBlurData = await Promise.all(
        //   articles.map(async p => {
        //     const blurData = await getPlaceholderImage(p.thumbnail, 5, 10)
        //     return {
        //       ...p.toObject(), // Ensure you're working with plain objects
        //       blurData: blurData.placeholder
        //     }
        //   })
        // )

        const subCategory = await Category.find({ parent: item._id }).select(
          '_id name'
        )

        return {
          category: item.name[lang],
          subCategory,
          updatedAt: item.updatedAt,
          articles: articles.map(i => ({
            _id: i._id,
            title: i.title[lang],
            content: i.content[lang],
            thumbnail: i.thumbnail[lang],
            duration: i.duration,

            slug: i.slug,
            categories: i.categories.map(i => ({
              name: i.name[lang]
            })),
            createdAt: i.createdAt,
            publishedAt: i.publishedAt
          }))
        }
      })
    )

    await db.disconnect()
    return res.status(200).json(pfc)
  } catch (error) {
    console.error('Error fetching featured categories:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default handler
