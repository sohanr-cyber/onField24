import React from 'react'
import styles from '../../../styles/Admin/Home.module.css'

import Categories from '@/components/Admin/Dashboard/Categories'
import axios from 'axios'
import BASE_URL from '@/config'
import { useRouter } from 'next/router'
import t from '@/utility/dict'

const index = ({ categories, totalPages, currentPage }) => {
  const router = useRouter()
  const lang = router.locale
  return (
    <div className={styles.wrapper}>
      <Categories
        categories={categories}
        totalPages={totalPages}
        currentPage={currentPage}
        title={t('categoryList', lang)}
      />
    </div>
  )
}

export default index

export async function getServerSideProps (context) {
  try {
    const { page } = context.query
    const { locale } = context
    const response = await axios.get(
      `${BASE_URL}/api/category?lang=${locale || 'en'}&page=${page}`
    )
    const { categories, totalPages, page: currentPage } = response.data
    return {
      props: {
        categories,
        totalPages,
        currentPage
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      props: {
        title: 'Category List',
        categories: []
      }
    }
  }
}
