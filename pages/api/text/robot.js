import BASE_URL from '@/config'
import nc from 'next-connect'

const handler = nc()

handler.get(async (req, res) => {
  try {
    res.send(
      ` User-agent: *
        Allow: /
        Disallow: /terms-and-conditions
        Disallow: /privacy-policy
        Disallow: /admin

        
        # Sitemap
        Sitemap: ${BASE_URL}/sitemap.xml`
    )
  } catch (error) {
    console.log(error)
  }
})

export default handler
