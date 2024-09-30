import React, { useEffect, useState } from 'react'
import styles from '../../styles/SearchResult/SearchResult.module.css'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import GridViewIcon from '@mui/icons-material/GridView'
import axios from 'axios'
import BASE_URL from '@/config'
import { TurnRightSharp } from '@mui/icons-material'
import Pagination from '@/components/Utility/Pagination'
import { useRouter } from 'next/router'
import Article from '@/components/Article/Article'
import Article2 from '@/components/Article/Article2'
import t from '@/utility/dict'
import Filter from '@/components/News/Filter'
import { convertToBanglaNumber } from '@/utility/helper'

const sortOptions = [
  {
    value: 'Best Match',
    query: {
      sortBy: '',
      sortOrder: ''
    }
  },

  {
    value: 'Newest To Oldest',
    query: {
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    }
  },
  {
    value: 'Oldest To Newest',
    query: {
      sortBy: 'publishedAt',
      sortOrder: 'asc'
    }
  }
]
const Home = ({ articles, totalPages, currentPage, count, ads }) => {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState([])
  const router = useRouter()
  const lang = router.locale
  const updateRoute = data => {
    console.log({ data })
    const queryParams = { ...router.query, ...data }

    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
  }

  const sideBarAds = ads
    .filter(ad => ad.adType == 'sidebar')
    .map(ad => ({
      ...ad,
      thumbnail: ad.image,
      excerpt: ad.description,
      categories: [],
      tags: [],
      isAd: true
    }))

  const fetchTags = async () => {
    try {
      const { data } = await axios.get(`/api/tag?limit=50`)
      setTags(data.tags)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.filter} onClick={() => setOpen(true)}>
            <FilterAltIcon />
            {t('filter', lang)}
          </div>
          <div>
            {convertToBanglaNumber(count, lang)}{' '}
            {count > 1 ? t('items', lang) : t('item', lang)}{' '}
          </div>
        </div>
        <div className={styles.right}>
          <select
            onChange={e => {
              updateRoute(
                sortOptions.find(item => item.value == e.target.value).query
              )
            }}
          >
            {[...sortOptions].map((i, index) => (
              <option
                key={index}
                value={i.value}
                selected={
                  i.query.sortOrder == router.query.sortOrder ? true : false
                }
              >
                {t(i.value, lang)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.articles}>
        {[...sideBarAds, ...articles]?.map((item, index) => (
          <>
            {' '}
            <div className={styles.mediumToBig__width}>
              <Article
                key={index}
                article={item}
                redirect={true}
                style={{ minWidth: '180px' }}
              />
            </div>
            <div className={styles.small__width}>
              <Article2 key={index} article={item} />
            </div>
          </>
        ))}
      </div>
      <div className={styles.flex}>
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
      {open && (
        <div className={styles.filterOptions}>
          <Filter setOpen={setOpen} tags={tags} />
        </div>
      )}
    </div>
  )
}

export default Home

export async function getServerSideProps (context) {
  const {
    search = '',
    categories = '',
    tags = '',
    page = 1,
    sortBy = '',
    sortOrder = '',
    limit = 9
  } = context.query
  const { locale } = context

  try {
    // Use Promise.all to fetch articles and ads concurrently
    const [articlesResponse, adsResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/article`, {
        params: {
          lang: locale || '',
          search,
          categories,
          tags,
          page,
          sortBy,
          sortOrder,
          limit
        }
      }),
      axios.get(`${BASE_URL}/api/ad`, {
        params: {
          lang: locale,
          isActive: true,
          location: 'news',
          page,
          limit: 2
        }
      })
    ])

    const {
      articles,
      totalPages,
      page: currentPage,
      totalArticles: count
    } = articlesResponse.data

    return {
      props: {
        title: 'Article List',
        articles,
        ads: adsResponse.data.ads,
        totalPages,
        currentPage,
        count
      }
    }
  } catch (error) {
    console.error('Error fetching articles or ads:', error)
    return {
      props: {
        title: 'Article List',
        articles: [],
        ads: []
      }
    }
  }
}
