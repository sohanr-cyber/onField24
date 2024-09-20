import React, { useState } from 'react'
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
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  },
  {
    value: 'Oldest To Newest',
    query: {
      sortBy: 'createdAt',
      sortOrder: 'asc'
    }
  }
]
const Home = ({ articles, totalPages, currentPage, count }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const updateRoute = data => {
    console.log({ data })
    const queryParams = { ...router.query, ...data }

    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div>{count} items found </div>
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
              <option key={index} value={i.value}>
                {i.value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.articles}>
        {articles?.map((item, index) => (
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
          <Filter setOpen={setOpen} />
        </div>
      )}
    </div>
  )
}

export default Home

export async function getServerSideProps (context) {
  const { search, categories, tags, page, sortBy, sortOrder } = context.query
  console.log(context.query)
  const { locale } = context
  try {
    const response = await axios.get(
      `${BASE_URL}/api/article?lang=${locale || ''}&search=${
        search || ''
      }&categories=${categories || ''}&tags=${tags || ''}&page=${
        page || 1
      }&sortBy=${sortBy || ''}&sortOrder=${sortOrder || ''}`
    )
    const {
      articles,
      totalPages,
      page: currentPage,
      totalArticles: count
    } = response.data
    return {
      props: {
        title: 'Article List',
        articles,
        totalPages,
        currentPage,
        count
      }
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return {
      props: {
        title: 'Article List',
        articles: []
      }
    }
  }
}
