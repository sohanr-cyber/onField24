import React from 'react'
import styles from '../../../styles/Admin/Home.module.css'
import Users from '@/components/Admin/Dashboard/Users'
import BASE_URL from '@/config'
import axios from 'axios'
import { parse } from 'cookie'

const index = ({ users, totalPages, currentPage, page }) => {
  return (
    <div className={styles.wrapper}>
      <Users
        title={'User List'}
        users={users}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  )
}

export default index

export async function getServerSideProps (context) {
  try {
    const { page, query, position } = context.query
    const { id } = context.query
    const { locale, req } = context
    const cookies = parse(req.headers.cookie || '')

    const userInfo = cookies['userInfo']
      ? JSON.parse(cookies['userInfo'])
      : null

    if (!userInfo || !userInfo.token) {
      throw new Error('User is not authenticated')
    }

    const headers = { Authorization: `Bearer ${userInfo.token}` }

    const response = await axios.get(
      `${BASE_URL}/api/user?lang=${locale || ''}&page=${page || 1}&query=${
        query || ''
      }&position=${position}`,
      {
        headers
      }
    )
    const { users, totalPages, page: currentPage } = response.data
    console.log({ users })
    return {
      props: {
        title: 'User List',
        users,
        totalPages,
        currentPage
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      props: {
        title: 'User List',
        users: [],
        totalPages: 0,
        currentPage: 0
      }
    }
  }
}
