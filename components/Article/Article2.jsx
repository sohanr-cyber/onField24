import React from 'react'
import styles from '@/styles/Article/Article2.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
const Article2 = ({ article, index }) => {
  const router = useRouter()
  return (
    <div
      className={styles.wrapper}
      onClick={() => router.push(`/article/${article.slug}`)}
    >
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
