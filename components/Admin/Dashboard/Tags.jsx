import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Admin/Orders.module.css'
import Pages from '@/components/Utility/Pagination'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import { showSnackBar } from '@/redux/notistackSlice'
import { orderStatusColors } from '@/utility/const'
import { extractRGBA, readMinute } from '@/utility/helper'
import t from '@/utility/dict'

const Tags = ({ title, dashboard, tags, totalPages, count, currentPage }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTags, setFilteredTags] = useState({
    tags,
    totalPages,
    count,
    page: currentPage
  })

  useEffect(() => {
    setFilteredTags({ tags, totalPages, count, page: currentPage })
  }, [tags])

  const lang = router.locale

  const updateRoute = data => {
    const queryParams = { ...router.query, ...data }
    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
  }

  const remove = async id => {
    try {
      dispatch(startLoading())
      const { data } = await axios.delete(`/api/tag?id=${id}`)
      setFilteredTags({
        ...filteredTags,
        tags: filteredTags.tags.filter(i => i._id != id)
      })
      dispatch(finishLoading())
      dispatch(showSnackBar({ message: 'Tag Removed !' }))
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Deleting Tag !',
          option: {
            variant: 'error'
          }
        })
      )
    }
  }

  return (
    <>
      {' '}
      {!dashboard && <h2>{title}</h2>}
      <div className={styles.wrapper} id='tags'>
        {dashboard && <h2>{title}</h2>}
        {!dashboard && (
          <div className={styles.flex}>
            <div className={styles.left}>
              <input
                type='text'
                placeholder={`${t('search', lang)} ...`}
                value={searchQuery || router.query.name}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <span onClick={() => updateRoute({ name: searchQuery, page: 1 })}>
                <SearchIcon />
              </span>
            </div>
            <div className={styles.right}>
              <button onClick={() => router.push('/admin/tag/create')}>
                <span className={styles.plus__btn}>{t('addTag', lang)}</span>
                <span className={styles.plus__icon}>+</span>
              </button>
            </div>
          </div>
        )}
        <div className={styles.table__wrapper}>
          <table>
            <thead>
              <tr>
                <th>{t('name', lang)}</th>
                <th>{t('name', lang)}(BN)</th>
                <th>{t('action', lang)}</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {filteredTags?.tags?.map((tag, index) => (
                <tr
                  key={index}
                  style={{
                    borderLeft: `3px solid ${
                      orderStatusColors[
                        `${
                          tag.stockQuantity < 5
                            ? 'pending'
                            : tag.stockQuantity <= 1
                            ? 'failed'
                            : 'none'
                        }`.toLowerCase()
                      ]
                    }`,
                    background: `${extractRGBA(
                      orderStatusColors[
                        `${
                          tag.stockQuantity < 5
                            ? 'pending'
                            : tag.stockQuantity <= 1
                            ? 'failed'
                            : 'none'
                        }`.toLowerCase()
                      ],
                      0.1
                    )}`
                  }}
                >
                  <td>{tag.name['en']}</td>
                  <td>{tag.name['bn']}</td>

                  <td className={styles.action}>
                    <span onDoubleClick={() => remove(tag._id)}>
                      {t('delete', lang)}
                    </span>
                    <span
                      onClick={() =>
                        router.push(`/admin/tag/create?id=${tag._id}`)
                      }
                    >
                      {t('view', lang)}
                    </span>
                  </td>
                  {/* Add more table cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>{' '}
        </div>
        {!dashboard && (
          <div className={styles.pagination}>
            <Pages
              totalPages={filteredTags.totalPages}
              currentPage={filteredTags.page}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Tags
