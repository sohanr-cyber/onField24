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

const Articles = ({
  title,
  dashboard,
  articles,
  totalPages,
  count,
  currentPage
}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState({
    articles,
    totalPages,
    count,
    page: currentPage
  })

  useEffect(() => {
    setFilteredArticles({ articles, totalPages, count, page: currentPage })
  }, [articles])

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
      const { data } = await axios.delete(`/api/article?id=${id}`)
      setFilteredArticles({
        ...filteredArticles,
        articles: filteredArticles.articles.filter(i => i._id != id)
      })
      dispatch(finishLoading())
      dispatch(showSnackBar({ message: 'Product Removed !' }))
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Deleting Product !',
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
      <div className={styles.wrapper} id='articles'>
        {dashboard && <h2>{title}</h2>}
        {!dashboard && (
          <div className={styles.flex}>
            <div className={styles.left}>
              <input
                type='text'
                placeholder='Search by article name...'
                value={searchQuery || router.query.name}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <span onClick={() => updateRoute({ name: searchQuery, page: 1 })}>
                <SearchIcon />
              </span>
            </div>
            <div className={styles.right}>
              <button onClick={() => router.push('/admin/article/create')}>
                <span className={styles.plus__btn}>Add Article</span>
                <span className={styles.plus__icon}>+</span>
              </button>
            </div>
          </div>
        )}
        <div className={styles.table__wrapper}>
          <table>
            <thead>
              <tr>
                <th>Title </th>
                <th>Categories</th>
                <th>Tags</th>
                <th>Duration</th>
                <th>Views</th>
                <th>Action</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {filteredArticles?.articles?.map((article, index) => (
                <tr
                  key={index}
                  style={{
                    borderLeft: `3px solid ${
                      orderStatusColors[
                        `${
                          article.stockQuantity < 5
                            ? 'pending'
                            : article.stockQuantity <= 1
                            ? 'failed'
                            : 'none'
                        }`.toLowerCase()
                      ]
                    }`,
                    background: `${extractRGBA(
                      orderStatusColors[
                        `${
                          article.stockQuantity < 5
                            ? 'pending'
                            : article.stockQuantity <= 1
                            ? 'failed'
                            : 'none'
                        }`.toLowerCase()
                      ],
                      0.1
                    )}`
                  }}
                >
                  <td>{article.title}</td>

                  <td>
                    {article.categories?.map((item, index) => (
                      <span key={index}>
                        {item?.name} {'  '}
                      </span>
                    ))}
                  </td>
                  <td>
                    {' '}
                    {article.tags?.map((item, index) => (
                      <span key={index}>
                        {item?.name} {'  '}
                      </span>
                    ))}
                  </td>
                  <td>{readMinute(article.duration)}</td>
                  <td>{article.views}</td>

                  <td className={styles.action}>
                    <span onDoubleClick={() => remove(article._id)}>
                      Delete
                    </span>
                    <span
                      onClick={() =>
                        router.push(`/admin/article/create?id=${article._id}`)
                      }
                    >
                      View
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
              totalPages={filteredArticles.totalPages}
              currentPage={filteredArticles.page}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Articles
