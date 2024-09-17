import React, { useEffect, useState } from 'react'
import styles from '../../styles/Header/Header3.module.css'
import Image from 'next/image'
import { themeBg } from '@/utility/const'
import { useRouter } from 'next/router'
import { calculateReadingTimeFromHTML } from '@/utility/helper'
import EastIcon from '@mui/icons-material/East'

const Header3 = ({ contents }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

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
                {slide.title && <h2>{slide.title}</h2>}
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Quos, dolores sequi? Voluptatum cupiditate et vel
                  reprehenderit nesciunt temporibus iure voluptas nostrum
                  pariatur esse eos cumque quaerat ipsam, vitae excepturi sit!
                </p>
                <div className={styles.flex}>
                  <div className={styles.categories}>
                    {slide.categories.map((i, index) => (
                      <span>{i.name}</span>
                    ))}
                  </div>
                  <div>
                    {calculateReadingTimeFromHTML(slide.content)} minutes read
                  </div>
                  <div
                    className={styles.button}
                    onClick={() => router.push(`/article/${slide.slug}`)}
                  >
                    View <EastIcon />
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
