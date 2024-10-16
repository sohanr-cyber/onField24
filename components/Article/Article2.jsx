import React from 'react'
import styles from '@/styles/Article/Article2.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { handleViewArticle } from '@/redux/pixelSlice'
import { cleanUrl, readMinute } from '@/utility/helper'
import t from '@/utility/dict'
import axios from 'axios'
import TimeDistance from '../Utility/TimeDistance'
import { format } from 'date-fns'
const Article2 = ({ article, index, isAd }) => {
  const router = useRouter()
  const lang = router.locale

  const handleClick = article => {
    router.push(`/article/${article.slug}`)
    handleViewArticle(article)
  }

  const handleAdClick = ad => {
    axios.patch(`/api/ad/${ad._id}`)
    router.push(ad.targetUrl)
  }
  return (
    <div
      className={`${
        !article.isAd ? styles.wrapper : `${styles.wrapper} ${styles.adWrapper}`
      }`}
      onClick={() =>
        article.isAd ? handleAdClick(article) : handleClick(article)
      }
    >
      {article.isAd && (
        <div className={styles.sponsore}>{t('sponsored', lang)}</div>
      )}
      <div className={styles.image__container}>
        <Image
          src={article.thumbnail || '/images/logo.png'}
          width={'480'}
          height={'480'}
          alt={article.title}
        />
      </div>
      <div className={styles.text__container}>
        {!article.isAd && (
          <div className={styles.time__ago}>
            {format(article.publishedAt || article.createdAt, 'dd MMM , yyyy')}{' '}
          </div>
        )}{' '}
        <b className={styles.title}>
          {article.title.length > 60 ? (
            <>{article.title.substring(0, 60)} ...</>
          ) : (
            article.title
          )}
        </b>
        {article.targetUrl && (
          <div className={styles.targetURL}>{cleanUrl(article.targetUrl)}</div>
        )}
        <div className={styles.flex}>
          {article.targetText && (
            <div className={styles.button}>{article.targetText}</div>
          )}{' '}
          <div className={styles.time}>
            {readMinute(article.duration, lang)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article2
