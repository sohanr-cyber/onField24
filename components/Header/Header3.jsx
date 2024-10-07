import React, { useEffect, useState } from 'react'
import styles from '../../styles/Header/Header3.module.css'
import Image from 'next/image'
import { themeBg } from '@/utility/const'
import { useRouter } from 'next/router'
import {
  calculateReadingTimeFromHTML,
  readMinute,
  timeAgo
} from '@/utility/helper'
import EastIcon from '@mui/icons-material/East'
import t from '@/utility/dict'
import { formatDistanceToNow } from 'date-fns'

const Header3 = ({ contents, style }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  const lang = router.locale

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % contents.length)
    }, 5000) // Adjust the interval time as needed (in milliseconds)

    return () => {
      clearInterval(interval)
    }
  }, [contents.length])

  return (
    <div className={styles.wrapper} style={style ? { ...style } : {}}>
      <div className={styles.slider}>
        <>
          {' '}
          {contents.map((slide, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{
                backgroundImage: `url('${slide.thumbnail}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              <div className={styles.surface}>
                <div className={styles.text__container}>
                  {' '}
                  {slide.title && <h2>{slide.title}</h2>}
                  <p>{slide.excerpt.substring(0, 300)} . . .</p>
                </div>

                <div className={styles.flex}>
                  <div className={styles.time}>
                    {' '}
                    {timeAgo(
                      formatDistanceToNow(
                        new Date(slide.publishedAt || slide.createdAt)
                      ) + ' Ago',
                      lang
                    )}
                  </div>
                  <div className={styles.categories}>
                    {slide.categories?.slice(0, 2).map((i, index) => (
                      <span>{i.name}</span>
                    ))}
                  </div>
                  <div>{readMinute(slide.duration, lang)}</div>

                  <div
                    className={styles.button}
                    onClick={() => router.push(`/article/${slide.slug}`)}
                  >
                    {t('readMore', lang)} <EastIcon />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
      {/* <div className={styles.dots}>
        {contents.map((i, indx) => (
          <span
            key={indx}
            className={styles.dot}
            style={currentSlide == indx ? { background: themeBg } : {}}
            onClick={() => setCurrentSlide(indx)}
          ></span>
        ))}
      </div> */}
    </div>
  )
}

export default Header3
