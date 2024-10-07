import React from 'react'
import styles from '@/styles/Article/Article.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { readMinute } from '@/utility/helper'
import { handleViewArticle } from '@/redux/pixelSlice'
import t from '@/utility/dict'
import axios from 'axios'
import TimeDistance from '../Utility/TimeDistance'
const Article = ({ article, index, flex, style }) => {
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
      style={style ? { ...style } : {}}
    >
      {article.isAd && (
        <div className={styles.sponsore}>{t('sponsored', lang)}</div>
      )}
      <div className={styles.image__container}>
        <Image
          src={article.thumbnail}
          width={'480'}
          height={'480'}
          alt={article.title}
        />
        {!article.isAd && (
          <div className={styles.time__ago}>
            <TimeDistance article={article} />
          </div>
        )}{' '}
      </div>
      <div className={styles.text__container}>
        <div className={styles.text}>
          {' '}
          <div className={styles.title}>{article.title}</div>
          <div className={styles.excerpt}>
            {article.excerpt?.substring(0, 180)} ...
          </div>
        </div>
        <div className={styles.flex}>
          {article.targetText && (
            <div className={styles.button}>{article.targetText}</div>
          )}
          {[article.categories[0]].map((c, index) => (
            <span className={styles.category}>{c?.name}</span>
          ))}
          <div className={styles.time}>
            {readMinute(article.duration, lang)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article
