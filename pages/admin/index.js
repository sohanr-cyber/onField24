import React, { useEffect, useState } from 'react'
import styles from '../../styles/Admin/Home.module.css'
import SideBar from '@/components/Admin/SideBar'
import Graph from '../../components/Chart/Graph'
import LineChart from '../../components/Chart/LineChart'
import BarChart from '../../components/Chart/BarChart'
import Cards from '@/components/Admin/Dashboard/Cards'
import Reviews from '@/components/Admin/Dashboard/Reviews'
import Navbar from '@/components/Admin/Navbar'
import axios from 'axios'
import BASE_URL from '@/config'
import DateRangeIcon from '@mui/icons-material/DateRange'
import Pie from '../../components/Chart/Pie'

const data = result => {
  return [
    // {
    //   name: 'Total',
    //   value: result.total,
    //   color: statusColors['none']
    // },
    {
      name: 'Published',
      value: result.published,
      color: statusColors['published']
    },
    {
      name: 'Draft',
      value: result.draft,
      color: statusColors['draft']
    }
  ]
}

const index = ({ summary }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [client, setClient] = useState(false)
  const result = summarizeOrders(summary)
  const lang = router.locale

  const updateRoute = data => {
    if (data.filterType == 'Custom') {
      setOpen(true)
      return
    }
    const { startDate, endDate, ...queryParams } = { ...router.query, ...data }
    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
  }

  const handleClick = e => {
    console.log(e)
  }
  useEffect(() => {
    setClient(true)
  }, [])

  return (
    <div className={styles.wrapper}>
      {open && <DatePicker setOpen={setOpen} />}
      <div className={styles.welcome}>
        <div className={styles.left}>
          <h2 style={{ margin: '0', marginBottom: '5px' }}>
            {t('welcome', lang)}
          </h2>
          <div>{t('welcomeP', lang)}</div>
          {client && router.query.startDate && router.query.endDate && (
            <div
              style={{
                margin: '5px 0',
                color: `${themeBg}`,
                border: `1px solid ${borderColor}`,
                padding: '2px 5px',
                borderRadius: '5px',
                display: 'inline-block',
                fontWeight: 'bold'
              }}
            >
              {t('from', lang)} &nbsp;
              <span style={{ color: `${themeC}` }}>
                {convertToBanglaNumber(
                  router.query.startDate.split('T')[0],
                  lang
                )}
                &nbsp;
              </span>
              {t('to', lang)} &nbsp;
              <span style={{ color: `${themeC}` }}>
                {' '}
                {router.query.endDate.split('T')[0]}{' '}
              </span>
              &nbsp;
              <span
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => router.push('/admin')}
              >
                {' '}
                X
              </span>
            </div>
          )}
        </div>
        <div className={styles.right}>
          <DateRangeIcon
            onClick={() => setOpen(true)}
            className={styles.icon}
          />
        </div>
      </div>
      <div className={styles.cards_and_chart}>
        <div className={styles.left}>
          <Cards summary={result} />
        </div>
        <div className={styles.right}>
          <PieWithTag data={data(summarizeOrders(summary))} />
        </div>
      </div>

      <div className={styles.flex}>
        <Graph title={t('newsStatistics', lang)} summary={summary} />
        <BarChart title={t('readingStatistics', lang)} summary={summary} />
      </div>
    </div>
  )
}

export default index
import { parse } from 'cookie' // Import the `parse` function to handle cookies
import {
  convertToBanglaNumber,
  convertToCamelCase,
  getTime,
  summarizeOrders
} from '@/utility/helper'
import { useRouter } from 'next/router'
import DatePicker from '@/components/Admin/DatePicker'
import { borderColor, statusColors, themeBg, themeC } from '@/utility/const'
import PieWithTag from '@/components/Chart/PieWithTag'
import t from '@/utility/dict'

export async function getServerSideProps (context) {
  try {
    const { period, startDate, endDate } = context.query
    const { locale, req } = context
    const cookies = parse(req.headers.cookie || '')

    const userInfo = cookies['userInfo']
      ? JSON.parse(cookies['userInfo'])
      : null

    if (!userInfo || !userInfo.token) {
      throw new Error('User is not authenticated')
    }

    const headers = { Authorization: `Bearer ${userInfo.token}` }

    const { data: summary } = await axios.get(
      `${BASE_URL}/api/summary?period=${period || ''}&startDate=${
        startDate || ''
      }&endDate=${endDate || ''}`,
      {
        headers
      }
    )

    return {
      props: {
        summary
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        products: [],
        orders: [],
        total: {},
        orderGraph: {},
        summary: [],
        profit: {} // Include profit in the error case
      }
    }
  }
}
