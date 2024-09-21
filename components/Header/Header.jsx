import React from 'react'
import styles from '@/styles/Header/Header.module.css'
import Image from 'next/image'
import { readMinute } from '@/utility/helper'
import { formatDistanceToNow } from 'date-fns'
import EastIcon from '@mui/icons-material/East'
import { useRouter } from 'next/router'

const Header = ({ article }) => {
  const router = useRouter()
  return (
    <div
      className={styles.wrapper}
      onClick={() => router.push(`/article/${article.slug}`)}
    >
      <div className={styles.image__container}>
        <Image src={article.thumbnail} width={720} height={480} alt='' />
      </div>
      <div className={styles.text__container}>
        <div className={styles.flex}>
          <div className={styles.author}>
            <Image src={article.thumbnail} width={25} height={25} alt='' />
            <div className={styles.name}>Netflix</div>
          </div>
          <div className={styles.date}>
            {formatDistanceToNow(
              new Date(article.createdAt || article.publishedAt)
            )}{' '}
            Ago
          </div>
        </div>
        <h1>{article.title}</h1>
        <div className={styles.left__top}>
          <p>
            {article.excerpt || (
              <>
                {' '}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque,
                a eveniet. Quo aperiam odit, nulla nam ab, voluptate commodi
                quis ea, temporibus sunt excepturi odio delectus architecto
              </>
            )}
          </p>
          <div className={styles.flex}>
            <div className={styles.category}>{article.categories[0]?.name}</div>
            <div className={styles.time}>{readMinute(article.duration)}</div>
          </div>
          <div className={styles.button}>
            Read Now <EastIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
