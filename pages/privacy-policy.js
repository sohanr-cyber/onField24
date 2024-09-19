import React from 'react'
import styles from '@/styles/TermsAndCondition.module.css'
import { privacyPolicy } from '@/utility/data'
import { NextSeo } from 'next-seo'
import { privacyPolicySeoData } from '@/utility/const'
import { useRouter } from 'next/router'

const privacy = () => {
  const router = useRouter()
  const lang = router.locale
  return (
    <>
      <NextSeo {...privacyPolicySeoData} />{' '}
      <div className={styles.wrapper}>
        <div>
          <h2>Privacy Policy</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            vehicula felis id turpis dictum, non placerat lacus volutpat.
            Curabitur ut magna id turpis tempor hendrerit at nec lacus.
          </p>
        </div>
        {privacyPolicy.slice(0, privacyPolicy.length - 2).map((item, index) => (
          <div className={styles.item} key={index}>
            <h3>
              {' '}
              {item.section}. {item.title[lang]}
            </h3>
            <p>{item.content[lang]}</p>
          </div>
        ))}
        <div className={styles.item}>
          <h3>{privacyPolicy[privacyPolicy.length - 1].title[lang]}</h3>
          <p>{privacyPolicy[privacyPolicy.length - 1].content[lang]}</p>
        </div>
      </div>
    </>
  )
}

export default privacy
