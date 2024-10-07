import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Admin/Orders.module.css'
import Pages from '@/components/Utility/Pagination'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { showSnackBar } from '@/redux/notistackSlice'
import t from '@/utility/dict'

const Users = ({ title, dashboard, users, totalPages, currentPage }) => {
  const [filteredUsers, setFilteredUsers] = useState(users)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(router.query.query)
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: 'Bearer ' + userInfo?.token }
  const lang = router.locale

  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  const updateRoute = data => {
    const queryParams = { ...router.query, ...data, page: 1 }
    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
  }

  const remove = async id => {
    try {
      dispatch(startLoading())
      const { data } = await axios.delete(`/api/user/${id}`, { headers })
      setFilteredUsers(filteredUsers.filter(i => i._id != id))
      if (data.message) {
        dispatch(
          showSnackBar({
            message: data.message
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
    <>
      {!dashboard && <h2>{title}</h2>}

      <div className={styles.wrapper}>
        {' '}
        {dashboard && <h2>{title}</h2>}
        {!dashboard && (
          <div className={styles.flex}>
            <div className={styles.left}>
              <input
                type='text'
                placeholder={`${t('search', lang)} ...`}
                onChange={e => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
              <span onClick={() => updateRoute({ query: searchQuery })}>
                <SearchIcon />
              </span>
            </div>
            <div
              className={styles.right}
              style={{ display: 'flex', gap: '10px' }}
            ></div>
          </div>
        )}
        <div className={styles.table__wrapper}>
          <table>
            <thead>
              <tr>
                <th>{t('userId', lang)}</th>
                <th>{t('name', lang)}</th>
                <th>{t('email', lang)}</th>
                <th>{t('phone', lang)}</th>
                <th>{t('role', lang)}</th>
                <th>{t('action', lang)}</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {[...filteredUsers]?.map((user, index) => (
                <tr key={index}>
                  <td>{user._id.split('').slice(0, 9)}...</td>
                  <td>
                    {user.firstName}&nbsp; {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td
                    onClick={() =>
                      router.push(`/admin/order?query=${user.phone}`)
                    }
                  >
                    {user.phone}
                  </td>
                  <td>{user.role}</td>
                  <td className={styles.action}>
                    <span onDoubleClick={() => remove(user._id)}>Delete</span>
                    <span onClick={() => router.push(`/user/${user._id}`)}>
                      View
                    </span>
                  </td>

                  {/* Add more table cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!dashboard && (
          <div className={styles.pagination}>
            <Pages
              totalPages={totalPages}
              currentPage={router.query.page || currentPage}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Users
