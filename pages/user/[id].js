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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setUser(data)
  }, [data])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const updateRoute = data => {
    const queryParams = { ...router.query, ...data }
    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: true
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

  const updateRole = async (role, id) => {
    try {
      dispatch(startLoading())
      const { data } = await axios.put(
        '/api/user/role',
        {
          role: role,
          id: id
        },
        { headers }
      )
      setUser({ ...user, role: role })
      if (data) {
        dispatch(
          showSnackBar({
            message: 'Role Updated'
          })
        )
      }
      dispatch(finishLoading())
    } catch (error) {
      dispatch(finishLoading())
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
          {user.facebook && (
            <span
              className={styles.button}
              onClick={() => router.push(user.facebook)}
            >
              Contact
            </span>
          )}
          {user.facebook && (
            <span
              className={styles.button}
              onClick={() =>
                router.push(`https://m.me/${user.facebook.split('=')[1]}
`)
              }
            >
              Message
            </span>
          )}
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
              <b>{user.totalArticles}</b>
              <div>Total</div>
            </div>
            <div className={styles.item}>
              <b>{user.totalPublished}</b>
              <div>Published</div>
            </div>
            <div className={styles.item}>
              <b>{user.totalDraft}</b>
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
            <div className={styles.flex}>
              {' '}
              <div className={styles.field}>
                <label>First Name</label>
                <input
                  type='text'
                  value={user.firstName}
                  onChange={e =>
                    setUser({ ...user, firstName: e.target.value })
                  }
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
                value={user.address}
                onChange={e => setUser({ ...user, address: e.target.value })}
                placeholder='Dhaka - Rangpur - Kurigram'
              />
            </div>
            <div className={styles.field}>
              <label>facebook</label>
              <input
                type='text'
                value={user.facebook}
                onChange={e => setUser({ ...user, facebook: e.target.value })}
                placeholder='https://www.facebook.com/profile.php?id=100266481262836'
              />
            </div>
            <div className={styles.field}>
              <label>whatsapp</label>
              <input
                type='text'
                value={user.whatsapp}
                onChange={e => setUser({ ...user, whatsapp: e.target.value })}
                placeholder='+990164238922'
              />
            </div>
            {isClient && userInfo.role == 'admin' && userInfo.id != user._id && (
              <div className={styles.field}>
                <div className={styles.flex}>
                  {[
                    'admin',
                    'editor',
                    'journalist',
                    'contributor',
                    'moderator',
                    'subscriber',
                    'user'
                  ].map((i, index) => (
                    <span
                      style={
                        user.role == i
                          ? { background: 'black', color: 'white' }
                          : {}
                      }
                      onClick={() => updateRole(i, user._id)}
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.field}>
              <button onClick={() => updateUser()}>Update </button>
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
