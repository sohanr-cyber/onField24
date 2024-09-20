import React from 'react'
import styles from '@/styles/Article/Article2.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { handleViewArticle } from '@/redux/pixelSlice'
const Article2 = ({ article, index }) => {
  const router = useRouter()

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
      </div>
    </div>
  )
}

export default Article2
