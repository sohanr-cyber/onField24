import React from 'react'
import styles from '@/styles/Header/Header.module.css'
import Image from 'next/image'
import { readMinute, timeAgo } from '@/utility/helper'
import { formatDistanceToNow } from 'date-fns'
import EastIcon from '@mui/icons-material/East'
import { useRouter } from 'next/router'

const Header = ({ article }) => {
  const router = useRouter()
  const lang = router.locale

  return (
    <div
      className={styles.wrapper}
      onClick={() => router.push(`/article/${article.slug}`)}
    >
      <div className={styles.image__container}>
        <Image src={article?.thumbnail} width={720} height={480} alt='' />
      </div>
      <div className={styles.text__container}>
        <div className={styles.flex}>
          {article.author && (
            <div className={styles.author}>
              <Image
                src={
                  article?.author?.photo ||
                  'https://cdn-icons-png.flaticon.com/128/4322/4322991.png'
                }
                width={25}
                height={25}
                alt=''
              />
              <div className={styles.name}>
                {article.author?.firstName} {article.author?.lastName}
              </div>
            </div>
          )}
          <div className={styles.date}>
            {timeAgo(
              formatDistanceToNow(
                new Date(article.publishedAt || article.createdAt)
              ) + ' Ago',
              lang
            )}
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
