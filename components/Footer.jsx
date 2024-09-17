import React from 'react'
import styles from '../styles/Footer.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Logo from './Utility/Logo'
import { useSelector } from 'react-redux'
import { chunkArray } from '@/utility/helper'
import { feacebook_page, instagram, whatsapp, footerP } from '@/utility/const'

const Footer = () => {
  const router = useRouter()
  const categories = useSelector(state => state.article.categories)

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Logo />
          <div className={styles.about}>
            {categories &&
              categories.map((i, index) => (
                <div
                  className={styles.link}
                  onClick={() => router.push(`/shop?categories=${i[0]._id}`)}
                >
                  {i.name}
                </div>
              ))}
          </div>
        </div>
        <div className={styles.mid}>
          <h2 className={styles.heading}>Links</h2>
          <div className={styles.flex}>
            <div className={styles.link} onClick={() => router.push('/')}>
              Home
            </div>{' '}
            <div className={styles.link} onClick={() => router.push('/shop')}>
              News
            </div>
          </div>

          <div className={styles.flex}>
            <div className={styles.link} onClick={() => router.push('/login')}>
              Login
            </div>
            <div
              className={styles.link}
              onClick={() => router.push('/register')}
            >
              Register
            </div>
          </div>
          <div className={styles.flex}>
            <div
              className={styles.link}
              onClick={() => router.push('/privacy-policy')}
            >
              Privacy Policy
            </div>
            <div
              className={styles.link}
              onClick={() => router.push('/terms-and-conditions')}
            >
              Terms and Conditions
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <h2 className={styles.heading}>Contact</h2>
          <div className={styles.mail}>
            Address: House 41(meena bazar, lift 4), Gareeb-e-Newaz Avenue Road,
            Rangpur
          </div>
          <div className={styles.mail}>
            Mail: <span>mail@gmail.com</span>
          </div>
          <div className={styles.call}>
            Phone: <span>+8802305825832</span>
          </div>
          <div className={styles.social__media__links}>
            <Image
              src={'https://cdn-icons-png.flaticon.com/128/5968/5968764.png'}
              width='25'
              height='25'
              alt=''
              onClick={() => router.push(feacebook_page)}
            />
            <Image
              src={'https://cdn-icons-png.flaticon.com/128/3955/3955024.png'}
            width='25'
              height='25'
              alt=''
              onClick={() => router.push(instagram)}
            />
            <Image
              src={'https://cdn-icons-png.flaticon.com/128/733/733585.png'}
            width='25'
              height='25'
              alt=''
              onClick={() => router.push(whatsapp)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
