import React from 'react'
import styles from '../../../styles/Admin/Home.module.css'
// import Article from '@/components/Article'
import Articles from '@/components/Admin/Dashboard/Articles'
import BASE_URL from '@/config'
import axios from 'axios'
import { useRouter } from 'next/router'
import t from '@/utility/dict'

const index = ({ articles, totalPages, currentPage, count }) => {
  const router = useRouter()
  const lang = router.locale
  return (
    <div className={styles.wrapper}>
      <Articles
        title={t('articleList', lang)}
        articles={articles}
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
      `${BASE_URL}/api/article?lang=${locale || 'en'}&page=${
        page || '1'
      }&search=${search || ''}`
    )
    const {
      articles,
      totalPages,
      page: currentPage,
      totalArticles
    } = response.data
    return {
      props: {
        title: 'Article List',
        articles,
        totalPages,
        currentPage,
        count: totalArticles
      }
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return {
      props: {
        title: 'Article List',
        articles: [],
        coutn: 0,
        totalPages: 0
      }
    }
  }
}
