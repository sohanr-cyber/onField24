import React, { useEffect, useState } from 'react'
import styles from '../../styles/News/Details.module.css'
import axios from 'axios'
import BASE_URL from '@/config'
import { Rating, Stack } from '@mui/material'
import Image from 'next/image'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, addToBuyNow } from '@/redux/cartSlice'
import { useRouter } from 'next/router'
import { generateArticleSeoData, getPrice, getTime } from '@/utility/helper'
import { showSnackBar } from '@/redux/notistackSlice'
import { NextSeo } from 'next-seo'
import ArticlesByCategory from '@/components/Articles/ArticlesByCategory'
import {
  handleAddItemToCart,
  handleInitiateCheckout,
  handleViewArticle
} from '@/redux/pixelSlice'
import Loading from '@/components/Utility/Loading'
import Article2 from '@/components/Article/Article2'
import PBar from '@/components/Utility/PBar'
import Article from '@/components/Article/Article'
import FacebookIcon from '@mui/icons-material/Facebook'
import XIcon from '@mui/icons-material/X'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import ShareIcon from '@mui/icons-material/Share'
import { formatDistanceToNow } from 'date-fns'

export async function getServerSideProps (context) {
  const { slug } = context.params
  const { locale } = context

  try {
    const start = new Date()

    // Fetch the article based on the slug and the locale
    const { data } = await axios.get(
      `${BASE_URL}/api/article/${slug}?blur=true&lang=${locale}`
    )

    const end = new Date()

    // Extract the categories from the article data
    const categories = data.categories.map(i => i._id).join(',')

    let relatedArticles = []
    if (categories) {
      // Fetch related articles based on the categories, also filter by locale
      const resp = await axios.get(
        `${BASE_URL}/api/article?categories=${
          categories || ''
        }&limit=15&lang=${locale}`
      )

      // Exclude the current article from related articles
      relatedArticles = resp.data.articles.filter(i => i._id !== data._id)
    }

    console.log(`Data fetching time: ${end - start}ms`)

    return {
      props: {
        article: data,
        relatedArticles
      }
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return {
      props: {
        article: {},
        relatedArticles: [],
        error: error.message
      }
    }
  }
}

const News = ({ article, error, relatedArticles }) => {
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState(article?.sizes?.split(',')[0])
  const [thumbnail, setThumbnail] = useState(article?.thumbnail)
  const router = useRouter()
  const userInfo = useSelector(state => state.user.userInfo)
  const dispatch = useDispatch()
  const [isClient, setIsClient] = useState(false)
  const [blurDataURL, setBlurDataURL] = useState(null)
  const ReactPixel = useSelector(state => state.pixel.pixel)
  const buyNowItems = useSelector(state => state.cart.buyNow)
  const [loading, setLoading] = useState(false)

  const currentUrl = `${BASE_URL}/article/${article.slug}`

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${article.title}`
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${article.title}%20${currentUrl}`
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`

  useEffect(() => {
    setIsClient(true)
    setThumbnail(article.thumbnail)
  }, [article.slug])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.title,
          url: currentUrl
        })
        console.log('Article shared successfully')
      } catch (error) {
        console.error('Error sharing the article:', error)
      }
    } else {
      alert('Web Share API is not supported in this browser.')
    }
  }

  return (
    <>
      {loading && <Loading />}
      {/* <NextSeo {...generateArticleSeoData(article)} />{' '} */}
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <h1>{article.title} </h1>
          <PBar height={'2px'} />
          <div className={styles.flex}>
            <div className={styles.left}>
              <div className={styles.avater}>
                <Image src='/images/logo.png' width={32} height={32} alt='' />
              </div>
              <div className={styles.text}>
                <div className={styles.name}>Md Sohanur Rahman</div>
                <div className={styles.date}>
                  {/* {getTime(article.publishedAt)} */}
                  {article.publishedAt && (
                    <>{formatDistanceToNow(article.publishedAt)} Ago</>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div
                className={styles.icon}
                onClick={() => router.push(facebookShareUrl)}
              >
                <FacebookIcon />
              </div>
              <div
                className={styles.icon}
                onClick={() => router.push(twitterShareUrl)}
              >
                <XIcon />
              </div>
              <div
                className={styles.icon}
                onClick={() => router.push(linkedinShareUrl)}
              >
                <LinkedInIcon />
              </div>
              <div className={styles.icon}>
                <WhatsAppIcon onClick={() => router.push(whatsappShareUrl)} />
              </div>
              {/* <div className={styles.icon}>
                <ContentCopyIcon />
              </div> */}
              {isClient && navigator.share && (
                <div className={styles.icon}>
                  <ShareIcon onClick={() => handleShare()} />
                </div>
              )}
            </div>
          </div>
          <div className={styles.image__container}>
            <Image src={article.thumbnail} width={720} height={480} />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className={styles.description}
          />
          <div className={styles.tags}>
            {article.tags?.map((tag, index) => (
              <span>{tag.name}</span>
            ))}
          </div>
        </div>
        <div className={styles.right}>
          <h1>Read More </h1>
          <PBar height={'2px'} />
          <div className={styles.articles__horizontal}>
            {relatedArticles?.length > 0 &&
              relatedArticles.map((article, index) => (
                <Article2 article={article} />
              ))}
          </div>
          <div className={styles.articles__vertical}>
            {relatedArticles?.length > 0 &&
              relatedArticles.map((article, index) => (
                <Article article={article} />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default News
