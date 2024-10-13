import React, { useEffect, useRef, useState } from 'react'
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
import articleSlice from '@/redux/articleSlice'

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
                // backgroundImage: `url('${slide.thumbnail}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              <div className={styles.surface}>
                <div className={styles.image__container}>
                  <Image
                    src={slide?.thumbnail}
                    width={720}
                    height={480}
                    alt=''
                  />
                </div>
                <div className={styles.text__container}>
                  <div>
                    {' '}
                    <h1>{slide.title}</h1>
                    <div className={styles.date}>
                      {timeAgo(
                        formatDistanceToNow(
                          new Date(slide.publishedAt || slide.createdAt)
                        ) + ' Ago',
                        lang
                      )}
                    </div>
                    <div className={styles.left__top}>
                      <p>
                        {slide.excerpt || (
                          <>
                            {' '}
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Atque, a eveniet. Quo aperiam odit, nulla nam
                            ab, voluptate commodi quis ea, temporibus sunt
                            excepturi odio delectus architecto
                          </>
                        )}
                      </p>
                      <div className={styles.flex}>
                        <div className={styles.category}>
                          {slide.categories[0]?.name}
                        </div>
                        <div className={styles.time}>
                          {readMinute(slide.duration)}
                        </div>
                      </div>
                      <div className={styles.button}>Read Now</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
      <div className={styles.dots} sytle={{ minHeight: '10px' }}>
        {contents.map((i, indx) => (
          <span
            key={indx}
            className={styles.dot}
            style={currentSlide == indx ? { background: themeBg } : {}}
            onClick={() => setCurrentSlide(indx)}
          ></span>
        ))}
      </div>
    </div>
  )
}

export default Header3
