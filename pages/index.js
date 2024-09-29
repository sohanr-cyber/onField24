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
                <Header article={data[0].articles[0]} />
              </div>
              <div className={styles.header__midwidth}>
                <Header3 contents={[data[0].articles[0]]} />
              </div>
            </>
          )}
          <div className={styles.banner} style={{ paddingTop: '1px' }}>
            <Banner contents={bannerAds} />
          </div>
          {/* Latest Article */}
          <div className={styles.latest__articles}>
            <div className={styles.flex}>
              <h2>{t('latest', lang)}</h2>
              <div
                className={styles.button}
                onClick={() => router.push('/news')}
              >
                {t('seeAll', lang)} <EastIcon />
              </div>
            </div>
            <PBar height={'2px'} />
            <div className={styles.grid}>
              <>
                {[...sideBarAds, ...data[0].articles.slice(1, 9)].map(
                  (article, index) => (
                    <Article article={article} />
                  )
                )}
              </>
            </div>
          </div>
          <div
            className={styles.latest__articles}
            style={{ marginBottom: '-5px' }}
          >
            {' '}
            <div className={styles.flex}>
              <h2>{t('mustRead', lang)}</h2>
              {/* <div className={styles.button}>
                {t('seeAll', lang)} <EastIcon />
              </div> */}
            </div>
            <PBar height={'2px'} />
          </div>
          {data[1].articles.length > 0 && (
            <>
              <Header3 contents={[data[1].articles[0]]} />
              <div className={styles.articles}>
                {data[1].articles
                  .slice(1, data[1].articles.length)
                  .map((article, index) => (
                    <Article article={article} />
                  ))}
              </div>
            </>
          )}
          {/* By Category */}
          {chunkArray(data.slice(2, data.length)).map((c, index) => (
            <div className={styles.articles_bycategory}>
              <div className={styles.left}>
                <div className={styles.flex}>
                  <h2>{c[0]?.category}</h2>
                  <div
                    className={styles.button}
                    onClick={() => router.push(`/news?categories=${c[0]._id}`)}
                  >
                    {t('seeAll', lang)} <ArrowForwardIcon />{' '}
                  </div>
                </div>
                <PBar height={'2px'} />
                <div className={styles.grid2}>
                  {[...sideBarAds, ...c[0].articles]?.map((article, index) => (
                    <>
                      {' '}
                      <div className={styles.mediumToBig__width}>
                        <Article
                          article={article}
                          style={{
                            minWidth: '180px'
                          }}
                        />
                      </div>
                      <div className={styles.small__width}>
                        <Article2 article={article} />
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.flex}>
                  <h2>{c[1]?.category}</h2>
                  <div
                    className={styles.button}
                    onClick={() => router.push(`/news?categories=${c[1]._id}`)}
                  >
                    {t('seeAll', lang)} <ArrowForwardIcon />{' '}
                  </div>{' '}
                </div>
                <PBar height={'2px'} />

                <div className={styles.grid2}>
                  {c[1].articles?.map((article, index) => (
                    <>
                      {' '}
                      <div className={styles.mediumToBig__width}>
                        <Article
                          article={article}
                          style={{
                            minWidth: '180px'
                          }}
                        />
                      </div>
                      <div className={styles.small__width}>
                        <Article2 article={article} />
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export async function getStaticProps ({ locale }) {
  try {
    const start = new Date()

    // Fetch data during build time based on locale
    const { data } = await axios.get(
      `${BASE_URL}/api/article/bycategory?lang=${locale}`
    )

    const { data: ads } = await axios.get(
      `${BASE_URL}/api/ad?lang=${locale}&isActive=true&location=home&fromClient=true`
    )

    const end = new Date()
    console.log(`Data fetching time: ${end - start}ms`)

    return {
      props: {
        data,
        ads: ads.ads
      },
      revalidate: 60 // Regenerate the page every 60 seconds for fresh data
    }
  } catch (error) {
    console.error('Error fetching products:', error)

    return {
      props: {
        data: [] // Fallback in case of error
      },
      revalidate: 60 // Still revalidate to try again after error
    }
  }
}
