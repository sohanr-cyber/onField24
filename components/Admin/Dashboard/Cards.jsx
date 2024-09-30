import Card from '@/components/Chart/Card'
import React from 'react'
import styles from '../../../styles/Admin/Cards.module.css'
import { getTotalProfit, summarizeOrders } from '@/utility/helper'
import t from '@/utility/dict'
import { useRouter } from 'next/router'

const data = [
  {
    icon: 'https://cdn-icons-png.flaticon.com/128/8564/8564090.png',
    number: '$405,30',
    title: 'Total Sales'
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/128/6815/6815043.png',
    number: '530',
    title: 'Total Orders'
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/128/10543/10543159.png',
    number: '490',
    title: 'Orders Completed'
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/128/1090/1090965.png',
    number: '30',
    title: 'Orders Pending'
  }
]
4
const Cards = ({ summary }) => {
  const result = summary
  const router = useRouter()
  const lang = router.locale

  return (
    <div className={styles.wrapper}>
      <Card
        index={0}
        totalAmount={result.totalAmount}
        status={'None'}
        title={t('totalArticle', lang)}
        total={result.total}
        denominator={result.total}
        icon={'https://cdn-icons-png.flaticon.com/128/17385/17385190.png'}
      />

      <Card
        // item={{ ...data[1], number: total?.totalOrders }}
        index={1}
        status={'published'}
        title={t('published', lang)}
        total={result.published}
        denominator={result.total}
        icon={'https://cdn-icons-png.flaticon.com/128/1245/1245280.png'}
      />
      <Card
        // item={{ ...data[1], number: total?.totalOrders }}
        index={1}
        status={'draft'}
        title={t('draft', lang)}
        total={result.draft}
        denominator={result.total}
        icon={'https://cdn-icons-png.flaticon.com/128/1245/1245280.png'}
      />

      <Card
        // item={{ ...data[1], number: total?.totalOrders }}
        index={1}
        status={'views'}
        title={t('totalViews', lang)}
        total={result.views}
        // denominator={result.total}
        icon={'https://cdn-icons-png.flaticon.com/128/7756/7756168.png'}
      />

      <Card
        // item={{ ...data[1], number: total?.totalOrders }}
        index={1}
        status={'reads'}
        title={t('totalRead', lang)}
        total={result.reads}
        denominator={result.views}
        icon={'https://cdn-icons-png.flaticon.com/128/995/995726.png'}
      />
    </div>
  )
}

export default Cards
