import React, { useEffect, useState } from 'react'
import styles from '../../styles/Header/Banner.module.css'
import Image from 'next/image'
import { themeBg } from '@/utility/const'
import { useRouter } from 'next/router'
import { calculateReadingTimeFromHTML, readMinute } from '@/utility/helper'
import EastIcon from '@mui/icons-material/East'
import t from '@/utility/dict'
import { useSelector } from 'react-redux'

const Banner = ({ contents }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  const lang = router.locale
  const userInfo = useSelector(state => state.user.userInfo)

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
      {/* <div className={styles.sponsore}>sponsore</div> */}
      <div className={styles.slider}>
        <>
          {' '}
          {contents.map((slide, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: `translateX(-${currentSlide * 100}%)`
              }}
              onDoubleClick={() =>
                userInfo?.role == 'admin' &&
                router.push(`/admin/ad/create?id=${slide._id}`)
              }
            >
              <div className={styles.surface}>
                {slide.title && <h3>{slide.title}</h3>}
                <p>{slide.description}</p>
                <div className={styles.button}>{slide.targetText}</div>
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
