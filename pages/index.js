// 'use server'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header/Header'
import BASE_URL from '@/config'
import axios from 'axios'
import Header3 from '@/components/Header/Header3'
import List2 from '@/components/Categories/List2'
import Article from '@/components/Article/Article'
import PBar from '@/components/Utility/PBar'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EastIcon from '@mui/icons-material/East'
import Article2 from '@/components/Article/Article2'
import t from '@/utility/dict'
import { useRouter } from 'next/router'
import { chunkArray } from '@/utility/helper'
import { Widgets } from '@mui/icons-material'
import Banner from '@/components/Header/Banner'

export default function Home ({ data, ads }) {
  const router = useRouter()
  const lang = router.locale

  const bannerAds = ads.filter(ad => ad.adType == 'banner')
  const sideBarAds = ads
    .filter(ad => ad.adType == 'sidebar')
    .map(ad => ({
      ...ad,
      thumbnail: ad.image,
      excerpt: ad.description,
      categories: [],
      tags: [],
      isAd: true
    }))

  const chunkedArray = chunkArray(data.slice(1, data.length), 3)
  const chunkArrayLength = Math.floor(data.slice(1, data.length).length / 3)
  return (
    <>
      {data.length > 0 && (
        <div className={styles.wrapper}>
          <div className={styles.categories}>
            <List2 />
          </div>

          {data[0].articles.length > 0 && (
            <>
              <div className={styles.header__bigwidth}>
                {/* <Header article={data[0].articles[0]} /> */}
                <Header3 contents={data[0].articles} />
              </div>
              <div className={styles.header__midwidth}>
                <Header3 contents={data[0].articles} />
              </div>
            </>
          )}
          {/* <div className={styles.banner} style={{ paddingTop: '1px' }}>
            <Banner contents={bannerAds} />
          </div> */}
          {/* By Category */}
          <div className={styles.articles_bycategory}>
            {data.slice(1, data.length).map((ci, incex) => (
              <div className={styles.left}>
                <div className={styles.flex}>
                  <h2>{ci.category}</h2>
                  <div
                    className={styles.button}
                    onClick={() => router.push(`/news?categories=${c[0]._id}`)}
                  >
                    <ArrowForwardIcon />{' '}
                  </div>
                </div>
                <div className={styles.grid2}>
                  {[...sideBarAds, ...ci.articles]?.map((article, index) => (
                    <>
                      {index == 0 ? (
                        <Article
                          article={article}
                          style={{
                            minWidth: '180px'
                          }}
                        />
                      ) : (
                        <Article2 article={article} />
                      )}
                    </>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export async function getStaticProps ({ locale }) {
  try {
    const start = Date.now()

    // Fetch data concurrently
    const [articlesResponse, adsResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/article/bycategory?lang=${locale}`),
      axios.get(
        `${BASE_URL}/api/ad?lang=${locale}&isActive=true&location=home&fromClient=true`
      )
    ])

    const end = Date.now()
    console.log(`Data fetching time: ${end - start}ms`)

    return {
      props: {
        data: articlesResponse.data,
        ads: adsResponse.data.ads
      },
      revalidate: 60 // Regenerate the page every 60 seconds for fresh data
    }
  } catch (error) {
    console.error('Error fetching data:', error)

    return {
      props: {
        data: [], // Fallback in case of error
        ads: [] // Fallback for ads in case of error
      },
      revalidate: 60 // Still revalidate to try again after error
    }
  }
}
