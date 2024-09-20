import React from 'react'
import styles from '@/styles/Utility/LangPicker.module.css'
import { useRouter } from 'next/router'

const LangPicker = () => {
  const router = useRouter()

  const changeLocale = locale => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query } // Preserve the current query parameters
      },
      router.asPath,
      { locale }
    )
  }

  return (
    <div className={styles.flex}>
      <span
        onClick={() => changeLocale('en')}
        className={`${router.locale === 'en' ? styles.current : ''}`}
      >
        EN
      </span>
      <span
        onClick={() => changeLocale('bn')} // For Bengali
        className={`${router.locale === 'bn' ? styles.current : ''}`}
      >
        বাংলা
      </span>
    </div>
  )
}

export default LangPicker
