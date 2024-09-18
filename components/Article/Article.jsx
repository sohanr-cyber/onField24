import React from 'react'
import styles from '@/styles/Article/Article.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { readMinute } from '@/utility/helper'
const Article = ({ article, index, flex, style }) => {
  const router = useRouter()
  return (
    <div
      className={styles.wrapper}
      onClick={() => router.push(`/article/${article.slug}`)}
      style={style ? { ...style } : {}}
    >
      <div className={styles.image__container}>
        <Image
          src={article.thumbnail}
          width={'480'}
          height={'480'}
          alt={article.title}
        />
      </div>
      <div className={styles.text__container}>
        <div className={styles.text}>
          {' '}
          <div className={styles.title}>{article.title}</div>
          <div className={styles.excerpt}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a
            eveniet. Quo aperiam odit, nulla nam ab, voluptate commodi quis ea,
            temporibus sunt excepturi odio delectus architecto laudantium
            perspiciatis id!
          </div>
        </div>
        <div className={styles.flex}>
          {[article.categories[0]].map((c, index) => (
            <span className={styles.category}>{c.name}</span>
          ))}
          <div className={styles.time}>{readMinute(article.duration)}</div>
        </div>
      </div>
    </div>
  )
}

export default Article