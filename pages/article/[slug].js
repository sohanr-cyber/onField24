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
import { generateArticleSeoData, getTime } from '@/utility/helper'
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
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import t from '@/utility/dict'
import Banner from '@/components/Header/Banner'

export async function getStaticPaths () {
  // Fetch all available slugs for articles
  const { data } = await axios.get(`${BASE_URL}/api/article/slugs`)

  const paths = data.map(article => ({
    params: { slug: article.slug },
    locale: article.locale
  }))

  return {
    paths,
    fallback: 'blocking' // Use blocking so new pages are generated on-demand
  }
}
export async function getStaticProps({ params, locale }) {
  const { slug } = params;

  try {
    const start = Date.now();

    // Fetch the article and ads concurrently
    const [articleResponse, adsResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/article/${slug}?blur=true&lang=${locale}`),
      axios.get(`${BASE_URL}/api/ad?lang=${locale}&isActive=true&location=news`)
    ]);

    const { data: article } = articleResponse;
    const { data: ads } = adsResponse;
    const categories = article.categories.map(i => i._id).join(',');

    // Fetch related articles based on categories concurrently
    const relatedArticlesResponse = await axios.get(
      `${BASE_URL}/api/article?categories=${categories || ''}&limit=5&lang=${locale}`
    );

    const relatedArticles = relatedArticlesResponse.data.articles.filter(i => i._id !== article._id);

    const end = Date.now();
    console.log(`Data fetching time: ${end - start}ms`);

    return {
      props: {
        article,
        relatedArticles,
        ads: ads.ads
      },
      revalidate: 60 // Regenerate the page every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        article: {},
        relatedArticles: [],
        ads: [],
        error: error.message
      }
    };
  }
}


const News = ({ article, error, relatedArticles, ads }) => {
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState(article?.sizes?.split(',')[0])
  const [thumbnail, setThumbnail] = useState(article?.thumbnail)
  const router = useRouter()
  const lang = router.locale
  const userInfo = useSelector(state => state.user.userInfo)
  const dispatch = useDispatch()
  const [isClient, setIsClient] = useState(false)
  const [blurDataURL, setBlurDataURL] = useState(null)
  const ReactPixel = useSelector(state => state.pixel.pixel)
  const buyNowItems = useSelector(state => state.cart.buyNow)
  const [loading, setLoading] = useState(false)
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

  const currentUrl = `${BASE_URL}/article/${article.slug}`

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${article.title}`
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${article.title}%20${currentUrl}`
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`

  const view = async () => {
    try {
      const { data } = await axios.put('/api/article/view', {
        id: article._id
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setIsClient(true)
    setThumbnail(article.thumbnail)
    view()
  }, [article.slug])

  const read = async () => {
    try {
      const { data } = await axios.post('/api/article/view', {
        id: article._id
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      read()
    }, (article.duration || 2) * 60 * 1000 * 0.8)

    // Cleanup the timer if the user leaves before 2 minutes
    return () => clearTimeout(timer)
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
      <NextSeo {...generateArticleSeoData(article)} />{' '}
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.tags} style={{ marginBottom: '20px' }}>
            {article.categories?.map((c, index) => (
              <span onClick={() => router.push(`/news?categories=${c._id}`)}>
                {c.name}
              </span>
            ))}
          </div>
          <PBar height={'2px'} />
          <h1>{article.title} </h1>
          <PBar height={'2px'} />
          <div className={styles.flex}>
            {article.author && (
              <div className={styles.left}>
                <div className={styles.avater}>
                  <Image
                    src={
                      article.author.photo ||
                      'https://cdn-icons-png.flaticon.com/128/4322/4322991.png'
                    }
                    width={32}
                    height={32}
                    alt=''
                  />
                </div>
                <div className={styles.text}>
                  <div className={styles.name}>
                    {article.author.firstName} {article.author.lastName}
                  </div>
                  <div className={styles.date}>
                    {/* {getTime(article.publishedAt)} */}
                    {article.publishedAt && (
                      <>{formatDistanceToNow(article.publishedAt)} Ago</>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className={styles.right}>
              {isClient && userInfo?.role == 'admin' && (
                <div
                  className={styles.icon}
                  onClick={() =>
                    router.push(`/admin/article/create?id=${article._id}`)
                  }
                >
                  <AutoFixHighIcon />
                </div>
              )}
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
          <div className={styles.banner}>
            <Banner
              contents={bannerAds}
              style={{
                padding: '15px'
              }}
            />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className={styles.description}
          />
          <div className={styles.tags}>
            {article.tags?.map((tag, index) => (
              <span onClick={() => router.push(`/news?tags=${tag._id}`)}>
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.right}>
          <h1>{t('readMore', lang)} </h1>
          <PBar height={'2px'} />
          <div className={styles.articles__horizontal}>
            {[...sideBarAds, ...relatedArticles].length > 0 &&
              [...sideBarAds, ...relatedArticles].map((article, index) => (
                <Article2 article={article} />
              ))}
          </div>
          <div className={styles.articles__vertical}>
            {[...sideBarAds, ...relatedArticles].length > 0 &&
              [...sideBarAds, ...relatedArticles].map((article, index) => (
                <Article article={article} />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default News
