import React from 'react'
import styles from '../styles/Footer.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Logo from './Utility/Logo'
import { useSelector } from 'react-redux'
import { chunkArray } from '@/utility/helper'
import {
  feacebook_page,
  instagram,
  whatsapp,
  footerP,
  support_mail,
  support_number
} from '@/utility/const'
import t from '@/utility/dict'

const Footer = () => {
  const router = useRouter()
  const categories = useSelector(state => state.article.categories)
  const lang = router.locale

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.about}>
            {categories &&
              categories.map((i, index) => (
                <div
                  className={styles.link}
                  onClick={() => router.push(`/news?categories=${i._id}`)}
                >
                  {i.name}
                </div>
              ))}
          </div>
        </div>
        <div className={styles.mid}>
          <h2 className={styles.heading}> {t('link', lang)}</h2>
          <div className={styles.flex}>
            <div className={styles.link} onClick={() => router.push('/')}>
              {t('home', lang)}
            </div>{' '}
            <div className={styles.link} onClick={() => router.push('/news')}>
              {t('news', lang)}
            </div>
          </div>

          <div className={styles.flex}>
            <div className={styles.link} onClick={() => router.push('/login')}>
              {t('login', lang)}
            </div>
            <div
              className={styles.link}
              onClick={() => router.push('/register')}
            >
              {t('register', lang)}
            </div>
          </div>
          <div className={styles.flex}>
            <div
              className={styles.link}
              onClick={() => router.push('/privacy-policy')}
            >
              {t('privacyPolicy', lang)}
            </div>
            <div
              className={styles.link}
              onClick={() => router.push('/terms-and-conditions')}
            >
              {t('termsAndCondition', lang)}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <h2 className={styles.heading}>{t('contact', lang)}</h2>
          <div className={styles.mail}>
            {t('address', lang)}: {t('addressDetails', lang)}
          </div>
          <div className={styles.mail}>
            {t('mail', lang)}: <span>{support_mail}</span>
          </div>
          <div className={styles.call}>
            {t('phone', lang)}: <span>{support_number}</span>
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
