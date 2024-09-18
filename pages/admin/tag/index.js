import React from 'react'
import styles from '../../../styles/Admin/Home.module.css'
import axios from 'axios'
import BASE_URL from '@/config'
import Tags from '@/components/Admin/Dashboard/Tags'

const index = ({ tags, totalPages, currentPage }) => {
  return (
    <div className={styles.wrapper}>
      <Tags
        tags={tags}
        totalPages={totalPages}
        currentPage={currentPage}
        title={'Tag List'}
      />
    </div>
  )
}

export default index

export async function getServerSideProps (context) {
  try {
    const { page } = context.query
    const response = await axios.get(`${BASE_URL}/api/tag?page=${page}`)
    const { tags, totalPages, page: currentPage } = response.data
    return {
      props: {
        tags,
        totalPages,
        currentPage
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      props: {
        title: 'Tag List',
        tags: []
      }
    }
  }
}
