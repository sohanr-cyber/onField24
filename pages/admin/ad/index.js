import React from 'react'
import styles from '../../../styles/Admin/Home.module.css'
// import Ad from '@/components/Ad'
import Ads from '@/components/Admin/Dashboard/Ads'
import BASE_URL from '@/config'
import axios from 'axios'
import { useRouter } from 'next/router'
import t from '@/utility/dict'

const index = ({ ads, totalPages, currentPage, count }) => {
  const router = useRouter()
  const lang = router.locale
  return (
    <div className={styles.wrapper}>
      <Ads
        title={t('adList', lang)}
        ads={ads}
        totalPages={totalPages}
        count={count}
        currentPage={currentPage}
      />
    </div>
  )
}

export default index

export async function getServerSideProps (context) {
  try {
    const { page, search } = context.query
    const { locale } = context
    console.log('new rquesy for page', page)
    const response = await axios.get(
      `${BASE_URL}/api/ad?lang=${locale || 'en'}&page=${
        page || '1'
      }&search=${search || ''}`
    )
    const {
      ads,
      totalPages,
      page: currentPage,
      totalAds
    } = response.data
    return {
      props: {
        title: 'Ad List',
        ads,
        totalPages,
        currentPage,
        count: totalAds
      }
    }
  } catch (error) {
    console.error('Error fetching ads:', error)
    return {
      props: {
        title: 'Ad List',
        ads: [],
        coutn: 0,
        totalPages: 0
      }
    }
  }
}
