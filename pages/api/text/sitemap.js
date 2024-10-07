import BASE_URL from '@/config'
import nc from 'next-connect'
import axios from 'axios'
const handler = nc()

function generateSiteMap (articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         <!--We manually set the two URLs we know already-->
         <url>
           <loc>${BASE_URL}</loc>
                <changefreq>daily</changefreq>
        <priority>1.0</priority>
        </url>
         <url>
           <loc>${BASE_URL}/en</loc>
                <changefreq>daily</changefreq>
        <priority>1.0</priority>
        </url>
        <url>
        <loc>${BASE_URL}/login</loc>
        </url>
        <url>
        <loc>${BASE_URL}/register</loc>
        </url>
        <url>
        <loc>${BASE_URL}/en</loc>
        </url>
        <url>
        <loc>${BASE_URL}/en/login</loc>
        </url>
        <url>
        <loc>${BASE_URL}/en/register</loc>
        </url>
         ${articles
           .map(({ slug, publishDate }) => {
             return `
           <url>
               <loc>${`${BASE_URL}/article/${slug}`}</loc>
                             <lastmod>${new Date(
                               publishDate
                             ).toISOString()}</lastmod>

           </url>
           <url>
               <loc>${`${BASE_URL}/en/article/${slug}`}</loc>
                             <lastmod>${new Date(
                               publishDate
                             ).toISOString()}</lastmod>

           </url>
         `
           })
           .join('')}
       </urlset>
     `
}

handler.get(async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/article/slugs`)

    // We generate the XML sitemap with the articles data
    const sitemap = generateSiteMap(
      data.map(i => ({
        slug: i.slug,
        publishDate: i.publishedAt || new Date()
      }))
    )
    res.send(sitemap)
  } catch (error) {
    console.log(error)
    return res.status(400).send('something went wrong')
  }
})

export default handler
