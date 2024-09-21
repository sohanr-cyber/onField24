import React from 'react'
import styles from '@/styles/Article/Article2.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { handleViewArticle } from '@/redux/pixelSlice'
import { readMinute } from '@/utility/helper'
const Article2 = ({ article, index }) => {
  const router = useRouter()
  const lang = router.locale
  
  const handleClick = article => {
    router.push(`/article/${article.slug}`)
    handleViewArticle(article)
  }

  return (
    <div className={styles.wrapper} onClick={() => handleClick(article)}>
      <div className={styles.image__container}>
        <Image
          src={article.thumbnail || '/images/logo.png'}
          width={'480'}
          height={'480'}
          alt={article.title}
        />
      </div>
      <div className={styles.text__container}>
        <b className={styles.title}>{article.title}</b>
        <div className={styles.flex}>
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

export default Article2
