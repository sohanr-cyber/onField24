// 'use server'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import TopNav from '@/components/TopNav'
import Header from '@/components/Header/Header'
import Catergory from './news/[category]'
import Categories from '@/components/Categories/Categories'
import Footer from '@/components/Footer'
import BASE_URL from '@/config'
import axios from 'axios'
import Header2 from '@/components/Header/Header2'
import Header3 from '@/components/Header/Header3'
import List from '@/components/Categories/List'
import List2 from '@/components/Categories/List2'
import ArticlesByCategory from '@/components/Articles/ArticlesByCategory'
import Article from '@/components/Article/Article'
import PBar from '@/components/Utility/PBar'
const inter = Inter({ subsets: ['latin'] })
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EastIcon from '@mui/icons-material/East'
import Article2 from '@/components/Article/Article2'
export default function Home ({ data }) {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.categories}>
          <List2 />
        </div>
        <div className={styles.header__bigwidth}>
          <Header article={data[0].articles[0]} />
        </div>
        <div className={styles.header__midwidth}>
          <Header3 contents={[data[0].articles[0]]} />
        </div>
        {/* Latest Article */}
        <div className={styles.latest__articles}>
          <div className={styles.flex}>
            <h2>Latest News</h2>
            <div className={styles.button}>
              See All <EastIcon />
            </div>
          </div>
          <PBar height={'2px'} />
          <div className={styles.grid}>
            {data[0].articles.slice(1, 9).map((article, index) => (
              <Article article={article} />
            ))}
          </div>
        </div>
        <div className={styles.latest__articles}>
          {' '}
          <div className={styles.flex}>
            <h2>Featured News</h2>
            <div className={styles.button}>
              See All <EastIcon />
            </div>
          </div>
          <PBar height={'2px'} />
        </div>
        <Header3 contents={[data[0].articles[7]]} />
        <div className={styles.articles}>
          {data[0].articles
            .slice(5, data[0].articles.length)
            .map((article, index) => (
              <Article article={article} />
            ))}
        </div>
        {/* By Category */}
        <div className={styles.articles_bycategory}>
          <div className={styles.left}>
            <div className={styles.flex}>
              <h2>Technology</h2>
              <div className={styles.button}>
                See All <ArrowForwardIcon />{' '}
              </div>
            </div>
            <PBar height={'2px'} />
            <div className={styles.grid2}>
              {data[0].articles.slice(4, 8).map((article, index) => (
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
              <h2>Education</h2>
              <div className={styles.button}>See All </div>
            </div>
            <PBar height={'2px'} />

            <div className={styles.grid2}>
              {data[0].articles.slice(8, 12).map((article, index) => (
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
      </div>
    </>
  )
}

export async function getServerSideProps({ locale }) {
  try {
    const start = new Date()

    // Fetch the data on each request
    const { data } = await axios.get(
      `${BASE_URL}/api/article/bycategory?lang=${locale}`
    )
    
    const end = new Date()
    console.log(`time : ${end - start}ms`)
    
    return {
      props: {
        data,
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    
    return {
      props: {
        data: [],
      }
    }
  }
}

