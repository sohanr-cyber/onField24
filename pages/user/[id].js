import BASE_URL from '@/config'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/User/UserDetails.module.css'
import Image from 'next/image'
import { parse } from 'cookie'
import axios from 'axios'
import Articles from '@/components/Admin/Dashboard/Articles'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import { showSnackBar } from '@/redux/notistackSlice'

const user = ({ user: data }) => {
  const [user, setUser] = useState(data)
  const [current, setCurrent] = useState('article')
  const router = useRouter()
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: `Bearer ${userInfo?.token}` }
  const dispatch = useDispatch()

  useEffect(() => {
    setUser(data)
  }, [data])

  const updateRoute = data => {
    const queryParams = { ...router.query, ...data }
    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
  }

  const updateUser = async () => {
    const { articles, totalPages, count, currentPage, ...others } = user
    console.log(others)
    try {
      dispatch(startLoading())
      const { data } = await axios.put(
        `/api/user/${user._id}`,
        {
          ...others
        },
        {
          headers
        }
      )
      if (data) {
        dispatch(
          showSnackBar({
            message: 'Profile Updated !'
          })
        )
      }
      dispatch(finishLoading())
    } catch (error) {
      dispatch(
        showSnackBar({
          message: 'Error While Updating Profile !',
          option: {
            variant: 'error'
          }
        })
      )
      console.log(error)
    }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.image__container}>
          <Image
            src={
              user.pic ||
              'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
            }
            width={220}
            height={160}
            alt={user.firstName + user.lastName}
          />
        </div>
        <div className={styles.buttons}>
          <span className={styles.button}>Contact</span>
          <span className={styles.button}>Message</span>
          <span
            className={styles.button}
            onClick={() =>
              updateRoute({
                current: 'settings'
              })
            }
          >
            Settings
          </span>
          <span
            className={styles.button}
            onClick={() =>
              updateRoute({
                current: 'article'
              })
            }
          >
            Article
          </span>
        </div>
        <div className={styles.text__container}>
          <div className={styles.contribution}>
            <div className={styles.item}>
              <b>22</b>
              <div>Posts</div>
            </div>
            <div className={styles.item}>
              <b>19</b>
              <div>Published</div>
            </div>
            <div className={styles.item}>
              <b>02</b>
              <div>Draft</div>
            </div>
          </div>
          <div className={styles.details}>
            <b>
              {user.firstName} &nbsp; {user.lastName}
            </b>
            {/* <div className={styles.location}>Bucharest, Romania</div> */}
            <div className={styles.email}> {user.email}</div>

            <b className={styles.profession}>{user.role}</b>
            <div>{user.phone}</div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        {router.query.current == 'settings' && (
          <div className={styles.settings}>
            <div className={styles.field}>
              <label>First Name</label>
              <input
                type='text'
                value={user.firstName}
                onChange={e => setUser({ ...user, firstName: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Last Name</label>
              <input
                type='text'
                value={user.lastName}
                onChange={e => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Phone No.</label>
              <input
                type='text'
                value={user.phone}
                onChange={e => setUser({ ...user, phone: e.target.value })}
                placeholder='+8891329811'
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                type='text'
                value={user.email}
                // onChange={e => setUser({ ...user, firstName: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Address</label>
              <input
                type='text'
                value={user.location}
                onChange={e => setUser({ ...user, location: e.target.value })}
                placeholder='Dhaka - Rangpur - Kurigram'
              />
            </div>
            <div className={styles.field}>
              <button onClick={() => updateUser()}>update </button>
            </div>
          </div>
        )}

        {(router.query.current == 'article' || !router.query.current) && (
          <div className={styles.articles}>
            <Articles
              title={''}
              articles={user.articles}
              totalPages={user.totalPages}
              count={user.count}
              currentPage={user.currentPage}
              // dashboard={true}
              style={{ marginTop: '-35px' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default user
export async function getServerSideProps (context) {
  try {
    const { locale, req } = context
    const cookies = parse(req.headers.cookie || '')
    const { pageSize, page, search } = context.query

    const userInfo = cookies['userInfo']
      ? JSON.parse(cookies['userInfo'])
      : null

    if (!userInfo || !userInfo.token) {
      throw new Error('User is not authenticated')
    }

    const headers = { Authorization: `Bearer ${userInfo.token}` }
    const { id } = context.params

    const { data: user } = await axios.get(
      `
    ${BASE_URL}/api/user/${id}?pageSize=${pageSize || 13}&page=${
        page || 1
      }&search=${search || ''}&lang=${locale || ''}
        `,
      {
        headers
      }
    )

    return {
      props: {
        user
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        user: {} // Include profit in the error case
      }
    }
  }
}
