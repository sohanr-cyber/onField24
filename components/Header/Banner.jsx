import React, { useEffect, useState } from 'react'
import styles from '../../styles/Header/Banner.module.css'
import Image from 'next/image'
import { themeBg } from '@/utility/const'
import { useRouter } from 'next/router'
import { calculateReadingTimeFromHTML, readMinute } from '@/utility/helper'
import EastIcon from '@mui/icons-material/East'
import t from '@/utility/dict'

const Banner = ({ contents }) => {
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
    <div className={styles.wrapper}>
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
                {slide.title && <h3>{slide.title}</h3>}
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Magnam ducimus labore voluptate architecto sint laudantium
                  eius quibusdam non. Eaque cumque{' '}
                </p>
                <div className={styles.button}>Buy Now</div>
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

export default Banner
