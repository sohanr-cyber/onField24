import React from 'react'
import styles from '@/styles/TermsAndCondition.module.css'
import { termsAndConditions } from '@/utility/data'
import { NextSeo } from 'next-seo'
import { TermsAndConditionSeoData } from '@/utility/const'
import { useRouter } from 'next/router'

const termAndCondition = () => {
  const router = useRouter()
  const lang = router.locale
  
  return (
    <>
      {' '}
      <NextSeo {...TermsAndConditionSeoData} />
      <div className={styles.wrapper}>
        <div>
          <h2>Terms and Conditions</h2>
          <p>
            Welcome to [Your Company Name]! These terms and conditions outline
            the rules and regulations for the use of [Your Company Name]'s
            Website, located at [Website URL].
          </p>
          <p>
            By accessing this website, we assume you accept these terms and
            conditions. Do not continue to use [Website Name] if you do not
            agree to take all of the terms and conditions stated on this page.
          </p>
        </div>
        {termsAndConditions
          .slice(0, termsAndConditions.length - 2)
          .map((item, index) => (
            <div className={styles.item} key={index}>
              <h3>
                {' '}
                {item.section}. {item.title[lang]}
              </h3>
              <p>{item.content[lang]}</p>
            </div>
          ))}
        <div className={styles.item}>
          <h3>
            {termsAndConditions[termsAndConditions.length - 1].title[lang]}
          </h3>
          <p>
            {termsAndConditions[termsAndConditions.length - 1].content[lang]}
          </p>
        </div>
      </div>
    </>
  )
}

export default termAndCondition
